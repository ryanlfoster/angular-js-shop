"use strict";

var async = require('async');

exports.routesSetup = function (app, callback) {
    app.get("/", function (req, res) {
        async.parallel([

            // Load categories:
            function (callback) {
                global.database.models.Category.findAll({}).success(function (categoriesData) {
                    callback(null, categoriesData);
                });
            },

            // Load basket info
            function (callback) {
                global.database.models.Basket.find({UserId : req.user.id, status : 0}).success(function (basket) {
                    global.database.models.BasketItem.findAll({BasketId : basket.id}).success(function (basketItems) {
                        console.log(basketItems);
                        callback(null, basketItems);
                    });
                });
            }
        ],
            function (err, results) {

                var CATEGORIES = 0;
                var BASKET_INFO = 1;

                app.render('front', {
                    topCategories: results[CATEGORIES]
                }, function (err, html) {
                    res.render('layout', {
                        body: html,
                        title: 'JS Shop',
                        description: 'Express',
                        keywords: '',
                        basketInfo: results[BASKET_INFO]
                    });
                });
            });
    });

    callback();
};
