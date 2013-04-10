/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Category = sequelize.define('Category', {
    name     :{ type:Sequelize.STRING, defaultValue:""},
    description     :{ type:Sequelize.TEXT}
});


module.exports = Category;