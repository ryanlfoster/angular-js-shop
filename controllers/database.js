"use strict";

// Database ORM:
var Sequelize = require("sequelize");
var sequelize = new Sequelize('jsshop', 'u_jsshop', 'j55h0p', {
    host: 'localhost',
    dialect: 'mysql',
    define: { timestamps: false },
    pool: { maxConnections: 5, maxIdleTime: 30}
});


global.sequelize = sequelize;

// region Loading models
var User = require("../models/user-model"),
    Passport = require("../models/passport-model"),
    Image = require("../models/image-model"),
    Category = require("../models/category-model"),
    Product = require("../models/product-model"),
    Property = require("../models/property-model"),
    Address = require("../models/address-model"),
    Comment = require("../models/comment-model"),
    Basket = require("../models/basket-model"),
    BasketItem = require("../models/basket-item-model"),
    Order = require("../models/order-model");
// endregion

// region Relations definition
Address
    .hasMany(Order);

Basket
    .hasMany(BasketItem)
    .belongsTo(User);

BasketItem
    .belongsTo(Basket);

Category
    .hasMany(Property)
    .hasMany(Product)
    .belongsTo(Image);

Comment.hasMany(Comment, {as: 'Answer', foreignKey: 'ParentId', useJunctionTable: false});

Image
    .hasMany(Product);

Product
    .hasMany(Property)
    .hasMany(Category)
    .hasMany(Comment)
    .hasMany(Image)
    .hasOne(BasketItem);

Property
    .hasMany(Category)
    .hasMany(Product);

User
    .hasMany(Address)
    .hasMany(Passport)
    .hasMany(Basket)
    .hasMany(Order)
    .hasMany(Comment)
    .belongsTo(Image);

// endregion


var initialize = function (callback) {
    sequelize.sync({force: true}).success(function () {
        if(typeof(callback) === "function"){
            callback();
        }
    });
};

exports.routesSetup = function(app, callback){
    //initialize(callback);
    callback();
};


global.database = {
    models: {
        User: User,
        Passport: Passport,
        Image: Image,
        Category: Category,
        Product: Product,
        Property: Property,
        Address: Address,
        Comment: Comment,
        Basket: Basket,
        BasketItem: BasketItem,
        Order: Order
    }};
