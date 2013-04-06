/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Basket = sequelize.define('Basket', {
    quantity: Sequelize.INTEGER,
    price: Sequelize.INTEGER,
    status: Sequelize.INTEGER
});

module.exports = Basket;