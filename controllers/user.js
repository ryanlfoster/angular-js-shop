"use strict";

exports.middlewareSetup = function (app, callback) {
    console.log("User setup");

    // Guest user:
    app.use(function (req, res, next) {
        var User = global.database.models.User;
        if (!req.user) {
            User.create({login: 'guest', state: 'guest', lastname: 'Guest', firstname: 'User'}).success(function (user) {
                req.logIn(user.values, function (err) {
                    next();
                });
            }).error(function (err) {
                    console.log("Insert error: " + err);
                });
        } else {
            next();
        }
    });

    callback();
};
exports.routesSetup = function (app, callback) {
    app.get("/user", function (req, res) {
        // Enter route body
    });


    callback();
};

exports.check = function (req, res, next) {
    var userID = req.user ? req.user.id : 0;
    if (!userID) {
        res.send({status: "error", error: { message: "Необходима авторизация."}});
    } else {
        next();
    }
};