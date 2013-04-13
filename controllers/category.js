"use strict";

var UrlPath = require('./url-path');
var Loader = require('./loader');

var Category = global.database.models.Category;
var Product = global.database.models.Product;

exports.routesSetup = function (app, callback) {

    app.get("/category/:categoryId", function (req, res) {
        var categoryId = parseInt(req.params.categoryId, 10);

        Loader.get(req, ['categories', 'basket', 'breadcrumbs'], function (err, loaders) {
            Category.find(categoryId).success(function (category) {



                Category.findAll({where: {ParentId: category.id}}).success(function (categories) {
                    if (categories && categories.length > 0) {

                        UrlPath.assignUrls(req, categories, function (categories) {
                            app.render('category', {
                                category : category,
                                categories: categories,
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

                    } else {
                        category.getProducts().success(function (products) {
                            UrlPath.assignUrls(req, products, function (products) {
                                app.render('category', {
                                    products: products,
                                    category: category,
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
                    }
                });

            });

        });

    });

    callback();
};