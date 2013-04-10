/*global sequelize:true */
"use strict";

var Sequelize = require("sequelize");

var Basket = sequelize.define('Basket', {
    status: { type:Sequelize.INTEGER, defaultValue: 0}
});

Basket.Status = {
  NEW : 0,
  PROCESSING : 1,
  COMPLETE : 2
};

//Basket.find = function(query, callback){
//    callback([
//        { id : 1, name : "Apple iPhone 5", price : 300 },
//        { id : 2, name : "Fruit Tomato Red", price : 25 }
//    ]);
//};

module.exports = Basket;