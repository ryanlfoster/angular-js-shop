/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Passport = sequelize.define('Passport', {
    providerId : Sequelize.INTEGER,
    passportId : Sequelize.INTEGER
});

Passport.Provider = {
    google : 1,
    vkontakte : 2,
    twitter : 3,
    facebook : 4,
    odnoklassniki : 5
};

module.exports = Passport;