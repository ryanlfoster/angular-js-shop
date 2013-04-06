"use strict";

exports.setup = function(app){
    app.get('/product/:id', function(res, req){
        database.models.Product.find;
    });
};