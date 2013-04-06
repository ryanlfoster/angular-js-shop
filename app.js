/*global User:true, Passport: true, Password: true */

"use strict";

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    i18n = require('i18n'),
    util = require('util');

i18n.configure({
    locales: ['ru_RU', 'uk_UA', 'us_EN'],
    register: global,
    extension: '.json',
    debug: false
});

var database = require('./controllers/database');
var passport = require('./controllers/passport');

var app = express();

global.app = app;

app.set('port', process.env.PORT || 3000);

// region Express Configuration
app.configure('', function () {


    app.set('views', __dirname + '/views');
    app.set("view engine", "hjs");
    app.set('view options', { layout: false });
    app.use(express.favicon());
    app.use(express.logger('dev'));

    app.use(require('less-middleware')({
        force: true,
        prefix: '/stylesheets',
        dest: __dirname + '/public/css',
        src: __dirname + '/public/less',
        compress: true
    }));

    app.use(express.static(__dirname + '/public'));
    app.use(express.static(__dirname + '/'));

    var COOKIES_SECRET = '9y526Ta9M7Mm24X10lUIfqaTGY5RGzty';

    app.use(express.logger('dev'));
    app.use(express.bodyParser({ uploadDir: 'tmp/jsshop' }));
    app.use(express.cookieParser(COOKIES_SECRET));
    app.use(express.cookieSession({ secret: COOKIES_SECRET }));
    app.use(passport.initialize());
    app.use(database.initialize());
    app.use(passport.session());
    app.use(express.methodOverride());
    app.use(express.compress());
    app.use(app.router);

    app.use(function (req, res, next) {
        if (req.user) {
            i18n.setLocale(req.user.locale);
            next();
        } else {
            i18n.init(req, res, next);
        }
    });

    app.locals({
        __i: i18n.__,
        __n: i18n.__n,
        __d: require('lang-utils').humanizeTimeRange
    });
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
app.get('/', routes.index);
app.get('/users', user.list);

// endregion

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
