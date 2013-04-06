
exports.setup = function (app) {
    "use strict";

    // Database ORM:
    var Sequelize = require("sequelize");
    var sequelize = new Sequelize('jsshop', 'u_jsshop', 'j55h0p', {
        define: { timestamps: false }
    });

    global.sequelize = sequelize;

    // Crypto Module:
    var Password = {
        salt   :'kUEmiWETiPFn67d3JaGVW2b3H9ZLBtct',
        crypto :require('crypto'),
        encrypt:function (password, callback) {
            this.crypto.pbkdf2(password, this.salt, 20000, 32, function (err, hash) {
                callback(hash);
            });
        },
        compare:function (password, hash, callback) {
            this.crypto.pbkdf2(password, this.salt, 20000, 32, function (err, calculatedHash) {
                if (hash === calculatedHash) {
                    callback(true);
                } else {
                    callback(false);
                }
            });

        }
    };

    // Models:
    var User = require("../models/user-model"),
//        Passport = require("../models/passport-model"),
        Image = require("../models/image-model"),
        Category = require("../models/category-model"),
        Product = require("../models/product-model"),
        Property = require("../models/property-model"),
        Address = require("../models/address-model"),
        Comment = require("../models/comment-model"),
        Basket = require("../models/basket-model"),
        Order = require("../models/order-model");


    Address.hasMany(Order);

    Basket.hasMany(Order);

    Category.hasMany(Property);
    Category.hasMany(Product);

    Comment.hasOne(User);

    Image.hasMany(Product);
    Image.hasMany(Category);

    Product.hasMany(Property);
    Product.hasMany(Category);
    Product.hasMany(Comment);

    Property.hasMany(Category);
    Property.hasMany(Product);

    User.hasMany(Address);
 //   User.hasMany(Passport);
    User.hasMany(Basket);
    User.hasMany(Order);

    sequelize.sync({force: true});

//    sequelize.sync({force: true}).success(function () {
//        Password.encrypt('12345', function (hash) {
//
//            User.create({
//                name: "Oleksandr",
//                surname: "Sidko",
//                login: 'mortiy',
//                birthDate: "1989-04-21",
//                locale: 'ru_RU',
//                password: hash
//            }).success(function (user) {
//                    Password.encrypt('apple', function (appleHash) {
//                        User.create({
//                            firstname: "Steve Adam Christopher",
//                            lastname: "Jobs",
//                            login: 'sjobs',
//                            birthDate: "1955-02-24",
//                            locale: 'us_EN',
//                            password: appleHash
//                        }).success(function (user) {
//                                Image.create({
//                                    src: '/pictures/test-avatar-1.jpeg',
//                                    width: 100,
//                                    height: 100,
//                                    type: 'JPEG',
//                                    UserId: user.id
//                                }).success(function (photo) {
//                                        user.setImage(photo);
//                                    });
//
//                            });
//                    });
//
////                    var message1 = Message.create({
////                        SenderID: 2,
////                        text: "Проверка системы сообщений",
////                        RecepientID: user.id
////                    });
////
////                    var message2 = Message.create({
////                        SenderID: 2,
////                        text: "Ещё одино сообщение\nВ несколько строк даже",
////                        RecepientID: user.id
////                    });
//
////
////                    Image.create({
////                        src: '/pictures/test-photo-1.jpeg',
////                        width: 100,
////                        height: 100,
////                        type: 'jpeg',
////                        UserId: user.id
////                    }).success(function (picture) {
////                            Wish.create({
////                                title: "Flycam Nano DSLR",
////                                description: "Стабилизатор для моей видеокамеры",
////                                UserId: user.id
////                            }).success(function (wish) {
////                                    wish.setPicture(picture);
////                                });
////                        });
////
////                    Image.create({
////                        src: '/pictures/test-photo-2.jpeg',
////                        width: 100,
////                        height: 100,
////                        type: 'jpeg',
////                        UserId: user.id
////                    }).success(function (picture) {
////                            Wish.create({
////                                title: "Red Ferrari",
////                                description: "Очень даже спортивный автомобиль",
////                                time: new Date(),
////                                UserId: user.id
////                            }).success(function (wish) {
////                                    wish.setPicture(picture);
////                                });
////                        });
//                });
//
//        });
//
//
//    });

};