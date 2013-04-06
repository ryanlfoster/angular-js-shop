Sequelize = require("sequelize");

var Image = sequelize.define('Image', {
    path: Sequelize.STRING
});

module.exports = Image;
