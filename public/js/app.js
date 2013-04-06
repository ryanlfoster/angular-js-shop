/*global angular:true, _:true */

var newsApp;

(function () {
    "use strict";

    newsApp = angular.module('newsApp', []).
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

    newsApp.service("NewsService", ['$http', '$q', function ($http, $q) {

        var _this = this;
        var defer = $q.defer();

        $http.get('/data/news.json').success(function (newsData) {

            _this.getNews = function (id) {
                if (id) {
                    return _.findWhere(newsData, { "id": id});
                } else {
                    return newsData;
                }
            };

            defer.resolve(_this);
        });

        return defer.promise;

    }]);

}());

