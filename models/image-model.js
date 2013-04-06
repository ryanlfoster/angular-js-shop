/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

module.exports = sequelize.define('Image', {
    path: Sequelize.STRING
});
