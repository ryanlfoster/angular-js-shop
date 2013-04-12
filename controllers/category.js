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

        Loader.get(req, ['categories', 'basket'], function (err, loaders) {

            global.sequelize.query(
                    'SELECT p.id, p.name, p.description, p.price FROM products p ' +
                        'LEFT JOIN CategoriesProducts cp ON(p.id = cp.ProductId)' +
                        'WHERE cp.CategoryId = ' + categoryId).success(function (products) {
                    app.render('products', {
                        products: products
                    }, function (err, html) {
                        res.render('layout', {
                            body: html,
                            title: 'JS Shop',
                            description: 'Express',
                            keywords: '',
                            topCategories: loaders.categories,
                            basketInfo: loaders.basket
                        });
                    });
                });


        });



    });

    callback();
};