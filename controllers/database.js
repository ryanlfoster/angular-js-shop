"use strict";

// Database ORM:
var Sequelize = require("sequelize");
var sequelize = new Sequelize('jsshop', 'u_jsshop', 'j55h0p', {
    host: 'localhost',
    dialect: 'mysql',
    define: { timestamps: false },
    pool: { maxConnections: 5, maxIdleTime: 30}
});
var util = require('util');


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
    .hasOne(Category, {as: 'Parent', foreignKey: "ParentId", useJunctionTable: false})
    .belongsTo(Image);

Comment.hasMany(Comment, {as: 'Answer', foreignKey: 'ParentId', useJunctionTable: false});

Image
    .hasMany(Product);

Product
    .hasMany(Property)
    .belongsTo(Category)
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

        var i, j, k;

        var chainer = new Sequelize.Utils.QueryChainer();
        var categories = ["Phones", "Fruits", "Furniture", "Household", "Books"];
        var products = {
            Phones: ["HTC One", "Apple iPhone 5", "Samsung Galaxy SIII", "Sony Xperia"],
            Fruits: ["Apple", "Apricot", "Avocado", "Banana", "Breadfruit", "Bilberry", "Blackberry", "Blackcurrant", "Blueberry", "Currant", "Cherry", "Cherimoya", "Clementine", "Cloudberry", "Coconut", "Date", "Damson", "Dragonfruit", "Durian", "Eggplant", "Elderberry", "Feijoa", "Fig", "Gooseberry", "Grape", "Grapefruit", "Guava", "Huckleberry", "Honeydew", "Jackfruit", "Jettamelon", "Jambul", "Jujube", "Kiwi", "fruit", "Kumquat", "Legume", "Lemon", "Lime", "Loquat", "Lychee", "Mandarine", "Mango"],
            Furniture: ["Chair", "Table", "Bed", "Sofa", "Ottoman", "Bench", "Mattress", "Jukebox", "Korsi", "Bookcase", "Safe"],
            Household: ["Iron", "Clock", "Brush", "Refrigerator", "Microwave", "Dishwasher", "Scissors", "Wisk", "Salt and pepper set", "Vacuum cleaner"],
            Books: ["Pippi Longstocking", "Pitter Pen", "Harry Potter", "Lord of the Rings", "Perl Book", "A Tale of Two Cities", "The Little Prince", "The Hobbit", "And Then There Were None", "The Lion, the Witch and the Wardrobe", "The Da Vinci Code"]
        };

        for (i = 0; i < categories.length; i++) {
            var categoryId = i + 1;
            var categoryName = categories[i];

            // Create main categories:
            chainer.add(
                sequelize.query(util.format(
                    "INSERT INTO categories (id, name, description, ParentId) VALUES(%d, '%s', '%s', %d)",
                    categoryId, categoryName, "Random category description", 0
                ))
            );

            var productCategories = [];

            // Create subcategories categories:
            for (j = 1; j <= 4; j++) {
                var subcategoryId = categoryId * 10 + j;
                chainer.add(
                    sequelize.query(util.format(
                        "INSERT INTO categories (id, name, description, ParentId) VALUES(%d, '%s', '%s', %d)",
                        subcategoryId, "Sub " + categoryName + " " + j, "Random sub-category description", categoryId
                    ))
                );
                productCategories.push(subcategoryId);
            }


            var productsNames = products[categoryName];
            for (k = 1; k < 20; k++) {
                var productName = productsNames[Math.floor(Math.random() * productsNames.length)];
                var parentCategoryId = productCategories[Math.floor(Math.random() * productCategories.length)];
                chainer.add(
                    sequelize.query(util.format(
                        "INSERT INTO products (name, description, price, CategoryId) VALUES('%s', '%s', %d, %d)",
                        productName + " " + k, "Random \"" + productName + "\" description", 50 + Math.floor(Math.random() * 2350), parentCategoryId
                    ))
                );
            }
        }

        for (i = 0; i < 5; i++) {
            chainer.add(
                sequelize.query(util.format(
                    "INSERT INTO users (firstname, lastname) VALUES('%s', '%s')",
                    "Oleksandr", "Sidko"
                ))
            );
        }

        chainer.runSerially()
            .success(function () {
                callback();
            })
            .error(function (errors) {
                callback(errors);
            });

    });
};

exports.routesSetup = function (app, callback) {
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
