/*global angular:true, _:true */

var shopApp;

(function () {
    "use strict";

    shopApp = angular.module('shopApp', []).
        config(['$routeProvider', function ($route) {
            $route.
                when('/news', {
                    templateUrl: '/partials/news.html',
                    controller: "NewsController",
                    resolve: {"NewsService": "NewsService"}
                }).
                when('/news/:id', {
                    templateUrl: '/partials/news_big.html',
                    controller: "NewsDetailsController",
                    resolve: {"NewsService": "NewsService"}
                }).
                otherwise({redirectTo: '/news'});
        }]);

    shopApp.service("CategoriesService", ['$http', '$q', function ($http, $q) {

    }]);

    shopApp.service("BasketService", ['$http', '$q', function ($http, $q) {
        this.products = {};

        this.addProduct = function(productId){
//            if(!this.products[productId]){
//                this.products[productId] = 1;
//            } else {
//                this.products[productId]++;
//            }
            $http.get('/basket/add/' + productId, function(basketInfo){
                basketInfo;
            });

        };

        return this;
    }]);

    shopApp.service("ProductsService", ['$http', '$q', 'BasketService', function ($http, $q, basketService) {

        this.basket = basketService;

        this.getProducts = function (categoryId) {
            var defer = $q.defer();
            $http.get('/category/' + categoryId + '/products', function(productsData){
                defer.resolve(productsData);
            });
            return defer.promise;
        };

        return this;

    }]);

}());

