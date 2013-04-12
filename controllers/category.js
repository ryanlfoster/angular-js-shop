"use strict";

var UrlPath = require('./url-path');
var Loader = require('./loader');

var Category = global.database.models.Category;
var Product = global.database.models.Product;

exports.routesSetup = function (app, callback) {

    app.get("/category/:categoryId/categories", function (req, res) {
        var categoryId = parseInt(req.params.categoryId, 10);

        Category.findAll({where: {parentId: categoryId}}).success(function (categories) {
            res.json({
                status: "success",
                data: categories
            });
        });
    });

    app.get("/category/:categoryId/products", function (req, res) {
        var categoryId = parseInt(req.params.categoryId, 10);

        Loader.get(req, ['categories', 'basket', 'breadcrumbs'], function (err, loaders) {
            Category.find(categoryId).success(function(category){
                category.getProducts().success(function(products){
                    UrlPath.assignUrls(products, function (products) {
                        app.render('category', {
                            products: products,
                            breadcrumbs: loaders.breadcrumbs
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
            });

        });


    });

    callback();
};