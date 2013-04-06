"use strict";

var db = require('../controllers/database');

module.exports = {
    setUp: function (callback) {
        this.foo = 'bar';
        db.initialize(function () {
            callback();
        });
    },
    testModels: function (test) {

        var companies = ['HTC', 'Apple', 'Samsung', 'LG', 'Nokia', "Sony"];
        var models = ['iPhone', 'Galaxy', 'One', 'Incredible', 'Lumia', "Experia"];
        var versions = ['2', '3G', '4S', '5', 'S I', "S II", 'S III', 'L', 'D', 'Z', "F200", "F500", "F800"];
        var randomPhoneModel = function () {
            return [companies, models, versions].reduce(function (previousValue, currentValue) {
                return previousValue + " " + currentValue[Math.floor(Math.random() * currentValue.length)];
            }, "").trim();
        };

        db.models.User.Password.encrypt('apple', function (appleHash) {
            db.models.User.create({
                firstname: "Steve Adam Christopher",
                lastname: "Jobs",
                login: 'sjobs',
                birthDate: "1955-02-24",
                locale: 'us_EN',
                password: appleHash
            }).success(function (steve) {
                    db.models.Image.create({
                        path: '/pictures/test-avatar-1.jpeg'
                    }).success(function (image) {
                            steve.setImage(image);
                        });

                    db.models.Basket.create({
                        UserId: steve.id
                    }).success(function (basket) {
                            db.models.Category.create({
                                name: "Телефоны",
                                description: "Мобильные и не очень"
                            }).success(function (category) {
                                    for (var i = 0; i < 10; i++) {

                                        db.models.Product.create({
                                            name: randomPhoneModel(),
                                            description: 'Очень хороший 4-дюймовый телефон',
                                            price: Math.round(Math.random() * 1000 + 100)
                                        }).success(function (product) {
                                                category.addProduct(product);
                                                db.models.BasketItem.create({
                                                    quantity: Math.ceil(Math.random() * 10),
                                                    BasketId: basket.id,
                                                    ProductId: product.id,
                                                    price: product.price
                                                });
                                            });
                                    }
                                    test.done();

                                });
                        });


                });
        });
    }
};
