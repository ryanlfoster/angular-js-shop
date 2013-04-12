/*global Loader:true */
"use strict";

var async = require('async');

var Loader = require('./loader');
var Product = global.database.models.Product;
var Image = global.database.models.Image;
var Comment = global.database.models.Comment;


exports.routesSetup = function (app, callback) {

    app.get("/product/:productId", function (req, res) {
        var productId = parseInt(req.params.productId, 10);

        Loader.get(req, ['categories', 'basket', 'breadcrumbs'], function (err, loaders) {

            Product.find(productId).success(function (product) {

                // TODO: Dynamic exchange rate:
                product.priceUah = Math.floor(product.price * 8.15);

                Loader.asyncGet(product, "Images", "Comments", function(productData){
                    var IMAGES = 0;
                    var COMMENTS = 1;

                    app.render('product', {
                        product: product,
                        images: productData[IMAGES],
                        comments: productData[COMMENTS],
                        breadcrumbs: loaders.breadcrumbs
                    }, function (err, html) {
                        res.render('layout', {
                            body: html,
                            title: product.name + ' - ' + 'JS Shop',
                            description: product.description,
                            keywords: '',
                            topCategories: loaders.categories,
                            basketInfo: loaders.basket
                        });
                    });
                });
            });

        });

    });

    callback();
};


