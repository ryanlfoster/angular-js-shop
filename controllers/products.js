/*global Loader:true */
"use strict";

exports.routesSetup = function (app, callback) {

    var Product = global.database.models.Product;
    var Image = global.database.models.Image;

    app.get("/product/:productId", function (req, res) {
        var productId = parseInt(req.params.productId, 10);

        Loader.get(req, ['categories', 'basket'], function (err, loaders) {

            Product.find(productId).success(function (product) {

                // TODO: Dynamic exchange rate:
                product.priceUah = Math.floor(product.price * 8.15);

                product.getImages().success(function (images) {
                    app.render('product', {
                        product: product,
                        images: images
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