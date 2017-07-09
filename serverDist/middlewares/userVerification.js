'use strict';

var VerificationMethods = require('./helpers/verification.js');

var UserVerificationMiddleware = {
	verifyApplication: function verifyApplication(req, res, next) {
		var query = req.query;
		if (query.instance !== undefined && query.compId !== undefined) {
			var appVerified = VerificationMethods.verifyAppInstance(query.instance);
			if (appVerified) {
				next();
			} else {
				res.status(500).end('Application authorization failed');
			}
		} else {
			res.status(500).end('Wrong or empty query request');
		}
	}
};

module.exports = UserVerificationMiddleware;