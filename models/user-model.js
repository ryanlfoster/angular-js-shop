/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var User = sequelize.define('User', {
    login: Sequelize.STRING,
    password: Sequelize.STRING,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    gender: { type: Sequelize.STRING, defaultValue: 'male' },
    locale: { type: Sequelize.STRING, defaultValue: 'ru_RU' },
    birthDate: Sequelize.DATE
});


User.Password = {
    salt: 'kUEmiWETiPFn67d3JaGVW2b3H9ZLBtct',
    crypto: require('crypto'),
    encrypt: function (password, callback) {
        this.crypto.pbkdf2(password, this.salt, 20000, 32, function (err, hash) {
            callback(hash);
        });
    },
    compare: function (password, hash, callback) {
        this.crypto.pbkdf2(password, this.salt, 20000, 32, function (err, calculatedHash) {
            if (hash === calculatedHash) {
                callback(true);
            } else {
                callback(false);
            }
        });

    }
};

User.Gender = {
    FEMALE: 'female',
    MALE: 'male'
};


module.exports = User;