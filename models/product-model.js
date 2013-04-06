/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Product = sequelize.define('Product', {
    name     :{ type:Sequelize.STRING, defaultValue:""},
    description     :{ type:Sequelize.TEXT, defaultValue:""}
});

module.exports = Product;