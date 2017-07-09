"use strict";

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app) {

    //pages

    app.get('/demo', function (req, res, next) {
        console.step('Demo route');
        res.end('Test page');
    });

    app.get('/js/test', function (req, res) {
        console.step('Test 1 route');
        app.use('/js', _express2.default.static(__dirname + '/../../test1'));
        res.sendFile(_path2.default.resolve(__dirname + '/../../test1/index.html'));
    });

    app.get('/html/test', function (req, res) {
        console.step('Test 2 route');
        app.use('/html', _express2.default.static(__dirname + '/../../test2'));
        res.sendFile(_path2.default.resolve(__dirname + '/../../test2/index.html'));
    });
};