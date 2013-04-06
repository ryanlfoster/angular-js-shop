/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Address = sequelize.define('Address', {
    field     :{ type:Sequelize.STRING, defaultValue:""},
    value   :{ type:Sequelize.STRING, defaultValue:""}
});

module.exports = Address;