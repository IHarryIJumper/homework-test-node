"use strict"

import express from 'express';

import path from 'path';

module.exports = function (app) {

    //pages

    app.get('/demo', function (req, res, next) {
        console.step('Demo route');
        res.end('Test page');
    });

    app.get('/js/test', (req, res) => {
        console.step('Test 1 route');
        app.use('/js',express.static(__dirname + '/../../test1'));
        res.sendFile(path.resolve(__dirname + `/../../test1/index.html`));
    });

    app.get('/html/test', (req, res) => {
        console.step('Test 2 route');
        app.use('/html', express.static(__dirname + '/../../test2'));
        res.sendFile(path.resolve(__dirname + `/../../test2/index.html`));
    });
}