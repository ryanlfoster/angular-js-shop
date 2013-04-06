"use strict";

exports.setup = function (app) {
    app.get("/user", function (res, req) {
        // Enter route body
    });
};
exports.check = function (req, res, next) {
    var userID = req.user ? req.user.id : 0;
    if (!userID) {
        res.send({status : "error", error : { message : "Необходима авторизация."}});
    } else {
        next();
    }
};