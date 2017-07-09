"use strict";

require('./applicationMethods/helpers/consoleLogHelper.js');
require('./applicationMethods/helpers/dateHelper.js');

const express = require('express');
const app = express();
const routes = require('./routes/routes.js');
const bodyParser = require('body-parser');

app.use((req, res, next) => {
	// console.log(req.method);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');

	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/public', express.static(__dirname + '/../public'));

routes(app);

app.listen(process.env.PORT || 8080);

console.info(`Listening on ${process.env.ROOT_URL || 'http://localhost'}:${process.env.PORT || 8080}`);