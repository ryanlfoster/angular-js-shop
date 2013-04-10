/*global shopApp:true, _:true */

(function (app) {
    "use strict";

    app.controller("ProductsController", ['$scope', 'ProductsService', 'BasketService', function(scope, productsService, basketService){
        scope.allProducts = productsService.getProducts();
        scope.basket = basketService;
    }]);

}(shopApp));

