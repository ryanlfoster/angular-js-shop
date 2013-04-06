/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Comment = sequelize.define('Comment', {
    type     : { 'type' : Sequelize.INTEGER, defaultValue : 0},
    status   : { 'type' : Sequelize.INTEGER, defaultValue : 0},
    time     : { 'type' : Sequelize.DATE, defaultValue : Sequelize.NOW },
    text     : { 'type' : Sequelize.TEXT }
});

module.exports = Comment;