/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var User = sequelize.define('User', {
    login: Sequelize.STRING,
    password: Sequelize.STRING,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    gender: { type : Sequelize.STRING, defaultValue : 'male' },
    locale: { type : Sequelize.STRING, defaultValue : 'ru_RU' },
    birthDate: Sequelize.DATE
});

User.Gender = {
    FEMALE : 'female',
    MALE : 'male'
};


module.exports = User;