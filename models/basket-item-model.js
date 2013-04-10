/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var BasketItem = sequelize.define('BasketItem', {
    quantity: {type : Sequelize.INTEGER, defaultValue : 0},
    price: Sequelize.INTEGER
});

module.exports = BasketItem;