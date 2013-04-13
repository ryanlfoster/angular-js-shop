"use strict";

var async = require('async');

var Loader = require('./loader');

exports.routesSetup = function (app, callback) {
    app.get("/", function (req, res) {

        Loader.get(req, ['categories', 'basket'], function(err, loaders){
            app.render('front', {
                topCategories: loaders.categories
            }, function (err, html) {
                res.render('layout', {
                    body: html,
                    title: 'JS Shop',
                    description: 'Express',
                    keywords: '',
                    topCategories: loaders.categories,
                    basketInfo: loaders.basket
                });
            });
        });
    });

    callback();
};
