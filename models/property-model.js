/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Property = sequelize.define('Property', {
    name     :{ type:Sequelize.STRING, defaultValue:""},
});

module.exports = Property;