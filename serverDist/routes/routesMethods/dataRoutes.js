'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');
var path = require('path');
var DatabaseConnection = require('../../database/database.js');
var VerificationMethods = require('../../middlewares/helpers/verification.js');
var SetSettings = require('./helpers/setSettings.js');

var colors = require('chalk');

var hightlight = colors.cyan;

var DataRoutes = function () {
	function DataRoutes() {
		_classCallCheck(this, DataRoutes);
	}

	_createClass(DataRoutes, null, [{
		key: 'getSettings',
		value: function getSettings(req, res, app) {
			console.log('GET getSettings', 'from', req.connection.remoteAddress);

			var sendData = function sendData(premium, settings) {
				var resolveData = {
					premium: premium,
					settings: settings
				};
				console.info('Successfull database request');
				res.send(resolveData);
			};

			var reqQuery = req.query,
			    data = VerificationMethods.getDecodedInstanceJSON(reqQuery.instance),
			    premium = VerificationMethods.getPremium(data),
			    getParam = 'end_points.id, end_points.widget_instance_id, end_points.comp_id, end_points.settings, widget_instances.id, widget_instances.instance_id',
			    databaseQuery = "SELECT " + getParam + " FROM end_points INNER JOIN widget_instances ON end_points.widget_instance_id=widget_instances.id WHERE end_points.comp_id=? AND widget_instances.instance_id=? LIMIT 1",

			// databaseQuery = "SELECT " + getParam + " FROM end_points INNER JOIN widget_instances ON end_points.widget_instance_id=widget_instances.id WHERE end_points.comp_id='" + reqQuery.compId + "' AND widget_instances.instance_id='" + data.instanceId + "' LIMIT 1",
			paramsArray = [reqQuery.compId, data.instanceId];
			// console.info(databaseQuery);
			if (DatabaseConnection.getConnection() !== null) {
				console.info('MySQL connection state: ', hightlight(DatabaseConnection.getConnection().state));
			}
			DatabaseConnection.databaseQuery(databaseQuery, paramsArray).then(function (resolve, reject) {
				if (reject) {
					res.status(501).send('Get settings error');
				} else {
					var settings = null;
					if (resolve.length !== 0) {
						settings = resolve[0].settings;
						sendData(premium, settings);
					} else {
						paramsArray[0] = paramsArray[0].split("-").pop();
						DatabaseConnection.databaseQuery(databaseQuery, paramsArray).then(function (resolve, reject) {
							if (reject) {
								res.status(501).send('Get settings error');
							} else {
								if (resolve.length !== 0) {
									settings = resolve[0].settings;
								}
								sendData(premium, settings);
							}
						});
					}
				}
			});
		}
	}, {
		key: 'setSettings',
		value: function setSettings(req, res, app) {
			console.log('POST setSettings', 'from', req.connection.remoteAddress);
			var reqQuery = req.query,
			    data = VerificationMethods.getDecodedInstanceJSON(reqQuery.instance),
			    settings = req.body;

			if (DatabaseConnection.getConnection() !== null) {
				console.info('MySQL connection state: ', hightlight(DatabaseConnection.getConnection().state));
			}
			SetSettings(res, data, reqQuery, settings);
		}
	}]);

	return DataRoutes;
}();

module.exports = DataRoutes;