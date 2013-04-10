/*global i18n:true*/

"use strict";

var fs = require('fs');
var i18n = require('i18n');

var SITE_DOMAIN = 'http://js-shop.mortiy.net';

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    VkontakteStrategy = require('passport-vkontakte').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    OdnoklassnikiStrategy = require('passport-odnoklassniki').Strategy,
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    console.log("Serializing user: " + user.id);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {

    console.log("Deserialize user: " + id);

    global.database.models.User.find(id).success(function (user) {

        if (user === null) {
            return done(i18n.__("Пользователь не найден."), null);
        }

        done(null, user.values);
//            db.models.Image.find(user.ImageId).success(function (picture) {
//                var userData = {};
//                if (user) {
//                    userData = user.values;
//                    userData.picture = (picture !== null) ? picture.values : {};
//                }
//                done(null, userData);
//            });

    }).error(function (error) {

            done(error, null);
        });
});

passport.userByToken = function (accessToken, refreshToken, profile, done) {
    var providerId = global.database.Passport.Provider[profile.provider];
    console.log(profile);
    global.database.models.Passport.find({ where: {providerId: providerId, passportId: profile.id}}).success(function (userPassport) {
        if (userPassport === null) {
            global.database.models.User.create({
                name: profile.name ? profile.name.givenName : profile.displayName,
                surname: profile.name ? profile.name.familyName : "",
                login: profile.username,
                gender: profile.gender ? profile.gender : global.database.models.User.Gender.MALE,
                locale: ( profile._json.locale ? profile._json.locale.substr(-2).toLowerCase() : null) ||
                    (profile._json.lang ? profile._json.lang.toLowerCase() : null) || 'ru'
            }).success(function (user) {
                    // Создаём папку для фотографий пользователя:
                    fs.mkdir('./public/pictures/' + user.id);

                    global.database.models.Passport.create({
                        providerId: providerId,
                        passportId: profile.id,
                        userId: user.id
                    }).success(function (userPassport) {
                            return done("", user.values);
                        });
                });
        } else {
            global.database.models.User.find(userPassport.userId).success(function (user) {
                return done("", user.values);
            });
        }
    });
};

var GOOGLE_CLIENT_ID = '442306874881.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'j3pim8T-3jHNBJyEy-jNAcVT';
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: SITE_DOMAIN + "/auth/google/callback"
    },
    passport.userByToken
));

var FACEBOOK_APP_ID = '125200990967856';
var FACEBOOK_APP_SECRET = 'f8ac9db98ba4e09e84fb77df520e82e7';
passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: SITE_DOMAIN + "/auth/facebook/callback"
    },
    passport.userByToken
));

var VKONTAKTE_APP_ID = 3225814;
var VKONTAKTE_APP_SECRET = 'VdCjPsnvJKWwnXSDBQcS';
passport.use(new VkontakteStrategy({
        clientID: VKONTAKTE_APP_ID,
        clientSecret: VKONTAKTE_APP_SECRET,
        callbackURL: SITE_DOMAIN + "/auth/vkontakte/callback"
    },
    passport.userByToken
));

var TWITTER_CONSUMER_KEY = '6e7wIgDgrFdSejf20qQL2A';
var TWITTER_CONSUMER_SECRET = '6p6czZKXmUCtWRyFn37YhWHd9XqQsNGWynt8yBTS3I';
passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: SITE_DOMAIN + "/auth/twitter/callback"
    },
    passport.userByToken
));

var ODNOKLASSNIKI_CONSUMER_KEY = '125287168';
var ODNOKLASSNIKI_CONSUMER_SECRET = '8E19F007AC99428F39B4F1B2';
var ODNOKLASSNIKI_PUBLIC_KEY = 'CBAMLIHIABABABABA';

passport.use(new OdnoklassnikiStrategy({
        clientID: ODNOKLASSNIKI_CONSUMER_KEY,
        clientSecret: ODNOKLASSNIKI_CONSUMER_SECRET,
        clientPublic: ODNOKLASSNIKI_PUBLIC_KEY,
        callbackURL: SITE_DOMAIN + "/auth/odnoklassniki/callback"
    },
    passport.userByToken
));


passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'passwd'
    },
    function (login, password, done) {

        var User = global.database.models.User;

        User.find({where: { login: login }}).success(function (user) {
            if (!user) {
                console.log('Unknown user');
                return done(null, false, { message: 'Unknown user' });
            }

            User.Password.compare(password, user.password, function (ok) {
                if (ok) {
                    console.log("User found!");
                    return done(null, user.values);
                } else {
                    console.log('Invalid password!');
                    return done(null, false, { message: 'Invalid password' });
                }
            });

        });
    }
));

exports.middlewareSetup = function(app, callback){
    app.use(passport.initialize());
    app.use(passport.session());
    callback();
};

exports.routesSetup = function (app, callback) {

    app.get('/logout', function (req, res) {
        req.session = null;
        res.redirect('/');
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.post('/auth/local',
        passport.authenticate('local', { successRedirect: '/',
            failureRedirect: '/login'
        })
    );

    app.get('/auth/google',
        passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }),
        function (req, res) {
        });

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/auth/facebook',
        passport.authenticate('facebook'),
        function (req, res) {
        });

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/auth/twitter',
        passport.authenticate('twitter'),
        function (req, res) {
        });

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/auth/odnoklassniki',
        passport.authenticate('odnoklassniki'),
        function (req, res) {
        });

    app.get('/auth/odnoklassniki/callback',
        passport.authenticate('odnoklassniki', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/auth/vkontakte',
        passport.authenticate('vkontakte'),
        function (req, res) {
        });

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
    app.get('/auth/user', function (req, res) {
        res.send(req.session.passport);
    });

    callback();
};
