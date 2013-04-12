"use strict";

var async = require('async');

var Model = global.database.models;

var Loaders = {
    categories : function (req, callback) {
        Model.Category.findAll({}).success(function (categoriesData) {
            callback(null, categoriesData);
        });
    },
    basket : function (req, callback) {
        Model.Basket.find({UserId: req.user.id, status: 0}).success(function (basket) {
            Model.BasketItem.findAll({BasketId: basket.id}).success(function (basketItems) {
                callback(null, basketItems);
            });
        });
    }
};

global.Loader = {
    get : function (req, loaders, callback) {

        if (!loaders) {
            loaders = [];
        } else {
            if (typeof(options) === "function") {
                callback = loaders;
            }
        }

        var tasks = [];

        for(var i = 0, j = loaders.length; i < j; i++){
            tasks.push(async.apply(Loaders[loaders[i]], req));
        }

        async.parallel(
            tasks,
            function (err, results) {
                var resultObject = {};
                for(var i = 0, j = loaders.length; i < j; i++){
                    resultObject[loaders[i]] = results[i];
                }
                callback(err, resultObject);
            }
        );
    }
};