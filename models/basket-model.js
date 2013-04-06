/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Basket = sequelize.define('Basket', {
    status: Sequelize.INTEGER
});

Basket.Status = {
  IN_PROCESS : 1,
  IN_ORDER : 2
};

module.exports = Basket;