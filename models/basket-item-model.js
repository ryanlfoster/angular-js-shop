/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var BasketItem = sequelize.define('BasketItem', {
    quantity: Sequelize.INTEGER,
    price: Sequelize.INTEGER
});

module.exports = BasketItem;