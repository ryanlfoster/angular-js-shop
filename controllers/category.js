"use strict";
exports.routesSetup = function (app, callback) {
    app.get("/category/:categoryId/categories", function (req, res) {
        var categoryId = parseInt(req.params.categoryId, 10);

        global.database.category.findAll({where: {parentId: categoryId}}).success(function (categories) {
            res.json({
                status: "success",
                data: categories
            });
        });
    });
    app.get("/category/:categoryId/products", function (req, res) {
        var categoryId = parseInt(req.params.categoryId, 10);


        global.sequelize.query(
                'SELECT p.id, p.name, p.description, p.price FROM products p ' +
                    'LEFT JOIN CategoriesProducts cp ON(p.id = cp.ProductId)' +
                    'WHERE cp.CategoryId = ' + categoryId).success(function (products) {
            res.render('products', {
                products: products
            });
        });
    });

    callback();
};