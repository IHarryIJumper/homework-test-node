'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getConnection = exports.connect = exports.databaseQuery = undefined;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connection = null,
    connectionConfig = null;

var hightlight = _chalk2.default.cyan,
    queueLimit = 50,
    acquireTimeout = 1000000,
    connectTimeout = 1000000;

var productionDatabase = {
	host: '198.199.120.148',
	user: 'slideshow',
	password: '92BTd9Ga',
	database: 'wixapp',
	// queueLimit: queueLimit,
	acquireTimeout: acquireTimeout,
	connectTimeout: connectTimeout,
	multipleStatements: true
	// database: 'impressive-slideshow-test'
},
    testDatabase = {
	host: '198.199.120.148',
	user: 'slideshow_test',
	password: 'Light123',
	database: 'wixapp_test',
	// queueLimit: queueLimit,
	acquireTimeout: acquireTimeout,
	connectTimeout: connectTimeout,
	multipleStatements: true
},
    localDatabase = {
	host: 'localhost',
	user: 'andrey',
	password: 'root',
	database: 'gallery_local',
	// queueLimit: queueLimit,
	acquireTimeout: acquireTimeout,
	connectTimeout: connectTimeout,
	multipleStatements: true
};

var getConnectionConfig = function getConnectionConfig() {

	return new _bluebird2.default(function (configResolve, configReject) {
		var NODE_ENV = process.env.NODE_ENV;


		switch (NODE_ENV) {
			case 'production':
				connectionConfig = productionDatabase;
				break;
			case 'testserver':
				connectionConfig = testDatabase;
				break;
			case 'development':
				connectionConfig = localDatabase;
				break;
			default:
				connectionConfig = localDatabase;
				break;
		}

		connection = _mysql2.default.createConnection(connectionConfig);

		console.step('Selected', hightlight(NODE_ENV), 'config for MySQL database');

		initConnect().then(function (resolve, reject) {
			if (reject) {
				configReject(true);
				connectionRepeat();
			} else if (resolve === true) {
				configResolve(true);
				console.step('Database connected!');
			}
		});
	});
};

var initConnect = function initConnect() {

	return new _bluebird2.default(function (resolve, reject) {
		if (connection !== null) {
			connection.connect(function (err) {
				if (err) {
					console.error('Database connection error: ' + err.stack);
					console.errorPrototype('Database:', hightlight(connectionConfig.database), 'user:', hightlight(connectionConfig.user), 'host:', hightlight(connectionConfig.host));
					reject(true);
					return;
				}

				console.info('Connection to database', hightlight(connectionConfig.database), 'is established as ID', hightlight(connection.threadId));
				resolve(true);
			});
		} else {
			var error = 'Database config not selected';
			console.error(error);
			throw error;
		}
	});
};

var databaseQuery = exports.databaseQuery = function databaseQuery(query, params, variable) {

	var queryCallback = function queryCallback(error, results, fields, resolve, reject) {
		if (error) {
			console.error(error);
			console.error('Query error.', 'Query:', hightlight(query));
			if (params !== undefined) {
				console.error('Params:', hightlight(params.toString()));
			}
			reject(true);
			connectionRepeat();
		};
		if (variable !== undefined) {
			resolve(results[0][variable]);
		} else {
			resolve(results);
		}
	};

	var connectionQuery = new _bluebird2.default(function (resolve, reject) {
		if (connection !== null) {
			if (params === undefined) {
				connection.query(query, function (error, results, fields) {
					// Array.prototype.push.apply(arguments, [resolve, reject]);
					// queryCallback.apply(this, arguments);
					queryCallback(error, results, fields, resolve, reject);
				});
			} else {
				connection.query(query, params, function (error, results, fields) {
					// Array.prototype.push.apply(arguments, [resolve, reject]);
					// queryCallback.apply(this, arguments);
					// queryCallback.call(this, error, results, fields, resolve, reject);
					queryCallback(error, results, fields, resolve, reject);
				});
			}
		} else {
			var error = "Can't process query request. Connection doesn't exist.";
			console.error(error);
			reject(true);
			connectionRepeat();
		}
	});

	if (connection.state !== 'authenticated') {
		connectionRepeat().then(function (resolve, reject) {
			if (reject) {
				connectionRepeat();
			} else {
				return connectionQuery;
			}
		});
	} else {
		return connectionQuery;
	}
};

var connectionRepeat = function connectionRepeat() {
	return new _bluebird2.default(function (repeatResolve, repeatReject) {
		if (connection !== null) {
			connection.destroy();
		}
		console.error("Database connection error");
		console.log("Connection repeat in 1 seconds...");
		setTimeout(function () {
			getConnectionConfig().then(function (configResolve, configReject) {
				if (configReject) {
					repeatReject(true);
				} else {
					repeatResolve(true);
				}
			});
		}, 1000);
	});
};

var connect = exports.connect = function connect() {
	getConnectionConfig().then(function (resolve, reject) {});
};

var getConnection = exports.getConnection = function getConnection() {
	return connection;
};

var DatabaseConnection = {
	getConnection: getConnection,
	connect: connect,
	getConnectionConfig: getConnectionConfig,
	initConnect: initConnect,
	databaseQuery: databaseQuery
};

exports.default = DatabaseConnection;