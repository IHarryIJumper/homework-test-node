'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PagesRoutesMethodsClass = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PagesRoutesMethodsClass = exports.PagesRoutesMethodsClass = function () {
	function PagesRoutesMethodsClass() {
		_classCallCheck(this, PagesRoutesMethodsClass);
	}

	_createClass(PagesRoutesMethodsClass, null, [{
		key: 'htmlRoute',
		value: function htmlRoute(req, res, app) {
			console.log('GET htmlRoute', 'from', req.connection.remoteAddress);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/index.html'));
		}
	}, {
		key: 'widgetRoute',
		value: function widgetRoute(req, res, app) {
			console.log('GET widget', 'from', req.connection.remoteAddress);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/widget.html'));
		}
	}, {
		key: 'demoRoute',
		value: function demoRoute(req, res, app) {
			console.log('GET demoRoute', 'from', req.connection.remoteAddress);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/demo.html'));
		}
	}, {
		key: 'seoRoute',
		value: function seoRoute(req, res, app) {
			// console.log('GET seoRoute', 'from', req.headers['x-forwarded-for']);
			console.log('GET seoRoute', 'from', req.connection.remoteAddress);

			// console.log(req.connection);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/seo.html'));
		}
	}, {
		key: 'settingsRoute',
		value: function settingsRoute(req, res, app) {
			console.log('GET settingsRoute', 'from', req.connection.remoteAddress);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/settings.html'));
		}
	}, {
		key: 'expandRoute',
		value: function expandRoute(req, res, app) {
			console.log('GET expandRoute', 'from', req.connection.remoteAddress);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/expand.html'));
		}
	}, {
		key: 'editSlideRoute',
		value: function editSlideRoute(req, res, app) {
			console.log('GET editSlideRoute', 'from', req.connection.remoteAddress);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/editSlide.html'));
		}
	}, {
		key: 'editTemplateRoute',
		value: function editTemplateRoute(req, res, app) {
			console.log('GET editTemplateRoute', 'from', req.connection.remoteAddress);

			app.use(_express2.default.static(__dirname + '/../../../dist'));
			res.sendFile(_path2.default.resolve(__dirname + '/../../../dist/editTemplate.html'));
		}
	}, {
		key: 'bundleRoute',
		value: function bundleRoute(req, res, app) {
			console.log('GET bundleRoute', 'from', req.connection.remoteAddress);

			// res.sendFile(path.resolve(__dirname + `/../../../frontEnd/dist/app.js`));
		}
	}]);

	return PagesRoutesMethodsClass;
}();