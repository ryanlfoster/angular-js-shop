/*global User:true, Passport: true, Password: true */

"use strict";

var express = require('express'),
    http = require('http'),
    path = require('path'),
    i18n = require('i18n'),
    async = require('async'),
    util = require('util');

i18n.configure({
    locales: ['ru_RU', 'uk_UA', 'us_EN'],
    register: global,
    extension: '.json',
    debug: false
});

var app = express();
global.app = app;

// region Express Configuration
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set("view engine", "hjs");
app.set('view options', { layout: false });
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(require('less-middleware')({
    force: true,
    prefix: '/css',
    dest: __dirname + '/public/css',
    src: __dirname + '/public/less',
    compress: true
}));

app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/'));
app.use(express.logger('dev'));
app.use(express.bodyParser({ uploadDir: 'tmp/jsshop' }));

var COOKIES_SECRET = '9y526Ta9M7Mm24X10lUIfqaTGY5RGzty';
app.use(express.cookieParser(COOKIES_SECRET));
app.use(express.cookieSession({ secret: COOKIES_SECRET }));
//
//app.use(function (req, res, next) {
//    if (req.user) {
//        i18n.setLocale(req.user.locale);
//        next();
//    } else {
//        i18n.init(req, res, next);
//    }
//});

app.locals({
    __i: i18n.__,
    __n: i18n.__n,
    __d: require('lang-utils').humanizeTimeRange
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.configure('production', function () {

    app.use(express.errorHandler());
    i18n.configure({
        updateFiles: false
    });
});

// endregion

// region Express Routes




var controllers = {
    database : require('./controllers/database'),
    passport : require('./controllers/passport'),
    loader : require('./controllers/loader'),
    user : require('./controllers/user'),
    basket : require('./controllers/basket'),
    products : require('./controllers/products'),
    category : require('./controllers/category'),
    front : require('./controllers/front')
};

var middlewareTasks = [];
var routesTasks = [];

console.log("Middleware controllers:");
for(var controllerName in controllers){
    if(typeof(controllers[controllerName].middlewareSetup) === 'function'){
        console.log(controllerName);
        middlewareTasks.push( async.apply(controllers[controllerName].middlewareSetup, app) );
    }
}
console.log("Routes controllers:");
for(var controllerName in controllers){
    if(typeof(controllers[controllerName].routesSetup) === 'function'){
        console.log(controllerName);
        routesTasks.push( async.apply(controllers[controllerName].routesSetup, app) );
    }
}

async.series(middlewareTasks, function(){

    console.log('Middleware setup complete!');

    app.use(express.methodOverride());
    app.use(express.compress());
    app.use(app.router);

    async.series(routesTasks, function(){
        http.createServer(app).listen(app.get('port'), function () {
            console.log('Express server listening on port ' + app.get('port'));
        });
    });


});




// endregion

