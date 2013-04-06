/**
 * Created with JetBrains WebStorm.
 * User: oleksandr.sidko
 * Date: 06.04.13
 * Time: 13:01
 * To change this template use File | Settings | File Templates.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};