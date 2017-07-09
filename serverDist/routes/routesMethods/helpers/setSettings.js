"use strict";

var DatabaseConnection = require('../../../database/database.js');

var setSettings = function setSettings(res, data, query, settings) {
	// setUser(res, data, query, settings);
	getExistingData(res, data, query, settings);
};

var setUser = function setUser(res, data, query, settings) {
	var getUserQuery = "SELECT user_sign_ins.id FROM user_sign_ins WHERE user_sign_ins.uid='" + data.uid + "'";

	DatabaseConnection.databaseQuery(getUserQuery).then(function (getUserResolve, getUserReject) {
		if (getUserReject) {
			res.status(501).send('Get user ID error');
		} else {

			// console.info(getUserResolve);
			var userId = 'NULL';
			if (getUserResolve.length !== 0) {
				userId = getUserResolve[0].id;
			}
			var userDataQuery = "INSERT INTO user_sign_ins (id, widget_id, uid, created_at, updated_at) VALUES (" + userId + ", " + 1 + ", '" + data.uid + "', NOW(), NOW()) ON DUPLICATE KEY UPDATE updated_at = NOW()";

			DatabaseConnection.databaseQuery(userDataQuery).then(function (setUserResolve, setUserReject) {
				if (setUserReject) {
					res.status(501).send('Set user ID error');
				} else {
					// console.info(setUserResolve.insertId);
					setWidgetInstance(res, data, query, settings);
				}
			});
		}
	});
};

var setWidgetInstance = function setWidgetInstance(res, data, query, settings) {
	var getWidgetInstanceQuery = "SELECT widget_instances.id FROM widget_instances WHERE widget_instances.instance_id='" + data.instanceId + "'";

	DatabaseConnection.databaseQuery(getWidgetInstanceQuery).then(function (getWidgetInstanceResolve, getWidgetInstanceReject) {
		if (getWidgetInstanceReject) {
			res.status(501).send('Get widget instance ID error');
		} else {

			// console.info(getWidgetInstanceResolve);
			var widgetInstanceId = 'NULL';
			if (getWidgetInstanceResolve.length !== 0) {
				widgetInstanceId = getWidgetInstanceResolve[0].id;
			}

			var userDataQuery = "INSERT INTO widget_instances (id, instance_id, sign_date, vendor_product_id, widget_id, created_at, updated_at, uid) VALUES (" + widgetInstanceId + ", '" + data.instanceId + "', '" + new Date(data.signDate).toMysqlFormat() + "', NULL, " + 1 + ", NOW(), NOW(), '" + data.uid + "') ON DUPLICATE KEY UPDATE updated_at = NOW()";

			DatabaseConnection.databaseQuery(userDataQuery).then(function (setWidgetInstanceResolve, setWidgetInstanceReject) {
				if (setWidgetInstanceReject) {
					res.status(501).send('Set widget instance ID error');
				} else {
					// console.info(setWidgetInstanceResolve.insertId);
					insertSettings(res, data, query, settings, setWidgetInstanceResolve.insertId);
				}
			});
		}
	});
};

var insertSettings = function insertSettings(res, data, query, settings, instanceTableId) {
	var getSettingsQuery = "SELECT end_points.id FROM end_points WHERE end_points.comp_id='" + query.compId + "'";

	var insert = function insert(settingsData, compId) {
		var settingsId = 'NULL';
		if (settingsData.length !== 0) {
			settingsId = settingsData[0].id;
		}

		var settingsString = JSON.stringify(settings);

		var setSettingsQuery = "INSERT INTO end_points (id, comp_id, settings, widget_instance_id, created_at, updated_at) VALUES (" + settingsId + ", '" + compId + "', '" + settings + "', " + instanceTableId + ", NOW(), NOW()) ON DUPLICATE KEY UPDATE updated_at = NOW(), settings = '" + settingsString + "'";

		DatabaseConnection.databaseQuery(setSettingsQuery).then(function (setSettingsResolve, setSettingsReject) {
			if (setSettingsReject) {
				res.status(501).send('Set settings error');
			} else {
				// console.info(setSettingsResolve.insertId);
				console.info('Successfull database request');
				res.send('Settings saved!');
			}
		});
	};

	DatabaseConnection.databaseQuery(getSettingsQuery).then(function (getSettingsResolve, getSettingsReject) {
		if (getSettingsReject) {
			res.status(501).send('Get settings ID error');
		} else {

			// console.info(getSettingsResolve);

			if (getSettingsResolve.length === 0) {
				var compId = query.compId.split("-").pop(),
				    getSettingsQueryWithoutComp = "SELECT end_points.id FROM end_points WHERE end_points.comp_id='" + compId + "'";
				DatabaseConnection.databaseQuery(getSettingsQueryWithoutComp).then(function (getSettingsWithoutCompResolve, getSettingsWithoutCompReject) {
					if (getSettingsWithoutCompReject) {
						res.status(501).send('Get settings ID error');
					} else {

						// console.info(getSettingsWithoutCompResolve);

						if (getSettingsWithoutCompResolve.length === 0) {
							insert(getSettingsWithoutCompResolve, query.compId);
						} else {
							insert(getSettingsWithoutCompResolve, compId);
						}
					}
				});
			} else {
				insert(getSettingsResolve, query.compId);
			}
		}
	});
};

var getExistingData = function getExistingData(res, data, query, settings) {
	var getUserQuery = "SELECT user_sign_ins.id FROM user_sign_ins WHERE user_sign_ins.uid='" + data.uid + "';";
	var getWidgetInstanceQuery = "SELECT widget_instances.id FROM widget_instances WHERE widget_instances.instance_id='" + data.instanceId + "';";
	// const getSettingsQuery = "SELECT end_points.id FROM end_points WHERE end_points.comp_id='" + query.compId + "';";
	var getSettingsQuery = "SELECT end_points.id, end_points.comp_id FROM end_points WHERE end_points.comp_id IN (?, ?);";

	var insert = function insert(query) {
		DatabaseConnection.databaseQuery(query).then(function (setSettingsResolve, setSettingsReject) {
			if (setSettingsReject) {
				res.status(501).send('Set settings data error');
			} else {
				// console.info(setSettingsResolve.insertId);
				console.info('Successfull database request');
				res.send('Settings saved!');
			}
		});
	};

	DatabaseConnection.databaseQuery(getUserQuery + getWidgetInstanceQuery + getSettingsQuery, [query.compId, query.compId.split('-').pop()]).then(function (getExistingDataResolve, getExistingDataReject) {
		if (getExistingDataReject) {
			res.status(501).send('Get rows ID error');
		} else {

			// console.info(getExistingDataResolve);
			var userId = 'NULL';
			if (getExistingDataResolve[0].length !== 0) {
				userId = getExistingDataResolve[0][0].id;
			}

			var widgetInstanceId = 'NULL';
			if (getExistingDataResolve[1].length !== 0) {
				widgetInstanceId = getExistingDataResolve[1][0].id;
			}

			var settingsId = 'NULL';
			if (getExistingDataResolve[2].length !== 0) {
				settingsId = getExistingDataResolve[2][0].id;
			}

			// console.info(userId, widgetInstanceId, settingsId);

			var settingsString = JSON.stringify(settings);

			var userDataQuery = "INSERT INTO user_sign_ins (id, widget_id, uid, created_at, updated_at) VALUES (" + userId + ", " + 1 + ", '" + data.uid + "', NOW(), NOW()) ON DUPLICATE KEY UPDATE updated_at = NOW();";
			var widgetInstanceQuery = "INSERT INTO widget_instances (id, instance_id, sign_date, vendor_product_id, widget_id, created_at, updated_at, uid) VALUES (" + widgetInstanceId + ", '" + data.instanceId + "', '" + new Date(data.signDate).toMysqlFormat() + "', NULL, " + 1 + ", NOW(), NOW(), '" + data.uid + "') ON DUPLICATE KEY UPDATE updated_at = NOW();";
			var setInsertedInstanceId = "SET @insertedInstanceId = LAST_INSERT_ID();";
			var setSettingsQuery = "INSERT INTO end_points (id, comp_id, settings, widget_instance_id, created_at, updated_at) VALUES (" + settingsId + ", '" + query.compId + "', '" + settingsString + "', @insertedInstanceId, NOW(), NOW()) ON DUPLICATE KEY UPDATE updated_at = NOW(), settings = '" + settingsString + "';";

			insert(userDataQuery + widgetInstanceQuery + setInsertedInstanceId + setSettingsQuery);
			// console.log(userDataQuery + widgetInstanceQuery + setInsertedInstanceId + setSettingsQuery);
		}
	});
};

var SetSettings = setSettings;

module.exports = SetSettings;