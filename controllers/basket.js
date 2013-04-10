"use strict";

var Basket = global.database.models.Basket;
var Product = global.database.models.Product;
var BasketItem = global.database.models.BasketItem;

exports.routesSetup = function (app, callback) {

    app.get("/basket/add/:productId", function (req, res) {

        var productId = parseInt(req.params.productId, 10);

        if(!req.user){
            return res.json({
                status : 'Error',
                message : 'No user found!'
            });
        }

        Product.find(productId).success(function (product) {
            if (!product) {
                res.json({
                    status: "Error",
                    message: "Product can't be found!"
                });
                return;
            }
            Basket.findOrCreate({UserId: req.user.id, status: 0}).success(function (basket) {
                console.log("Basket ID: " + basket.id);
                BasketItem.findOrCreate({BasketId: basket.id, ProductId: product.id}).success(function (basketItem) {
                    console.log("Basket Item ID: " + basketItem.id);
                    basketItem.quantity++;
                    basketItem.price = product.price;
                    basketItem.save().success(function () {
                        res.json({
                            status: 'Success',
                            product: product
                        });
                    }).error(function () {
                            res.json({
                                status: 'Error',
                                message: "Can't update basket item"
                            });
                        });
                });
            });
        });
    });

    callback();
};