"use strict";

exports.routesSetup = function(app, callback){
    app.get('/product/:id', function(req, res){
        database.models.Product.find;
    });

    callback();
};