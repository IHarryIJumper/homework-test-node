'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AuthorizationMiddleware = undefined;

var _collectionHelpers = require('../applicationMethods/helpers/collectionHelpers.js');

var AuthorizationMiddleware = exports.AuthorizationMiddleware = {
	checkSession: function checkSession(req, res, next) {
		// console.log(req.method);
		// console.log(req.session);
		if (req.session.authorized === true && req.session.username !== undefined) {
			// console.log(req.session.username + ' LOGGED IN')
			next();
		} else {
			var data = req.body;
			// console.log(data);
			// console.log(req);
			if (data.application !== undefined && data.instance !== undefined) {
				var appVerified = false;
				switch (data.application) {
					case 'slideshow':
						appVerified = _collectionHelpers.SettingsApiMethods.verifySlideshowInstance(data.instance);
						break;
					case 'testSlider':
						appVerified = _collectionHelpers.SettingsApiMethods.verifyTextSliderInstance(data.instance);
						break;
					case 'welcomeBar':
						appVerified = _collectionHelpers.SettingsApiMethods.verifyWelcomeBarInstance(data.instance);
						break;
					case 'sideMenu':
						appVerified = _collectionHelpers.SettingsApiMethods.verifySideMenuInstance(data.instance);
						break;
				}

				if (appVerified) {
					console.log(data.application + ' APPLICATION AUTHORIZED');
					next();
				} else {
					console.log('APPLICATION AUTHORIZATION FAILED:');
					console.log(data);
					res.status(500).end('Application authorization failed');
				}
			} else {
				if (req.method === 'GET') {
					// Commented for debug
					var urlReferer = AuthorizationMiddleware.getLocation(req.headers.referer);
					if (req.originalUrl !== '/login' && urlReferer.pathname !== 'login') {
						res.writeHead(303, {
							'Location': '/login'
						});
						res.end('Not authorized');
					} else {
						next();
					}
				} else {
					if (req.originalUrl !== '/login') {
						console.log('POST AUTHORIZATION FAILED');
						res.status(500).end('Authorization failed');
					} else {
						next();
					}
				}

				// next();
			}
		}

		// console.log('Request Type:', req.method);
		// next();
	},
	getLocation: function getLocation(href) {
		if (href !== undefined && href !== 'undefined') {
			var urlParts = href.split('/');

			// console.log(urlParts);
			var url = {
				hostname: urlParts[0] + '//' + urlParts[2],
				pathname: urlParts[3]
			};
			// console.log(url);
			return url;
		} else {
			return {
				hostname: null,
				pathname: null
			};
		};
	},
	loginPage: function loginPage(req, res, next) {
		if (req.session.authorized === true && req.session.username !== undefined) {
			res.writeHead(303, {
				'Location': '/'
			});
			res.end();
		} else {
			next();
		}
	}
};