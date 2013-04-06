/*global newsApp:true, _:true */

(function (app) {
    "use strict";

    app.controller("NewsController", ['$scope', 'NewsService',
        function (scope, service) {
            scope.allNews = service.getNews();
        }
    ]);

    app.controller("NewsDetailsController", ['$scope', '$routeParams', 'NewsService',
        function (scope, params, service) {
            var newsId = parseInt(params.id, 10);
            scope.news = service.getNews(newsId);
        }
    ]);

}(newsApp));

