"use strict";

exports.assignUrls = function(req, products, callback){
    for(var i = 0, j = products.length; i < j; i++){
        var p = products[i];
        p.url = "/product/" + p.id;
    }
    callback(products);
};

