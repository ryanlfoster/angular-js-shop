/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Order = sequelize.define('Order', {
    total_sum: Sequelize.FLOAT,
    createTime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    finishTime: Sequelize.DATE,
    status: Sequelize.INTEGER
});

module.exports = Order;