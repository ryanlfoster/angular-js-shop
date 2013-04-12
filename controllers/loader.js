"use strict";

var async = require('async');

var Model = global.database.models;

var Loaders = {
    categories : function (req, callback) {
        Model.Category.findAll({}).success(function (categoriesData) {
            if(req.params.categoryId){
                var categoryId = parseInt(req.params.categoryId, 10);
                for(var i = 0, j = categoriesData.length; i < j; i++){
                    if(categoriesData[i].id === categoryId){
                        categoriesData[i].isActive = true;
                        break;
                    }
                }

                callback(null, categoriesData);
            } else {
                callback(null, categoriesData);
            }

        });
    },
    basket : function (req, callback) {
        Model.Basket.find({UserId: req.user.id, status: 0}).success(function (basket) {
            if(!basket){
                return callback(null, []);
            }
            Model.BasketItem.findAll({BasketId: basket.id}).success(function (basketItems) {
                callback(null, basketItems);
            });
        });
    },
    breadcrumbs : function(req, callback){
        console.log("Generating breadcrumbs for: " + req.route.path);
        var c = req.route.path.split("/")[1];

        if(c === "product"){
            var productId = parseInt(req.params.productId, 10);
            Model.Product.find(productId).success(function(product){
                product.getCategory().success(function(category){

                    var breadcrumbs = '<a href="/category/' + category.id + '/products">' + category.name + '</a>' +
                        ' &rarr; ' + product.name;
                    callback(null, breadcrumbs);
                });

            });
        } else if(c === "category"){
            var categoryId = parseInt(req.params.categoryId, 10);
            Model.Category.find(categoryId).success(function(category){

                var breadcrumbs = "<h2>"+category.name+"</h2>";
                callback(null, breadcrumbs);

            });
        }

    }
};

module.exports = {
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
    },

    /**
     * Executes in parallel getters of Sequelize model
     * @param mainModel Model, getter of which will be executed
     * @param modelNames Names of linked models, which should be acquired
     * @param resultCallback Callback function with get results
     */
    asyncGet : function(mainModel, modelNames, resultCallback){
        var getters = [];
            resultCallback = arguments[arguments.length - 1];

        for(var i = 1, j = arguments.length - 1; i < j; i++){
            (function(modelName){
                getters.push(function(callback){
                    mainModel['get' + modelName]().success(function(dataArray){
                        callback(dataArray);
                    });
                });
            })(arguments[i]);
        }
        async.parallel(getters, function(resultData){
            resultCallback(resultData);
        });
    }
};