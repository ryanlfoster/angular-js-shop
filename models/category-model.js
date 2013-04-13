/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");
var util = require('util');

var Category = sequelize.define('Category', {
    name     :{ type:Sequelize.STRING, defaultValue:""},
    description     :{ type:Sequelize.TEXT}
});


Category.getParents = function(categoryId, callback){
    sequelize.query(util.format("CALL CategoryParents(%d)", categoryId)).success(function(parentCategories){
        callback(parentCategories);
    });
};

module.exports = Category;