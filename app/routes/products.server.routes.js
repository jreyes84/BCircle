'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var products = require('../../app/controllers/products');

	// Products Routes
	app.route('/products')
		.get(products.list)
		.post(users.requiresLogin, products.create)
		.put(products.update);
	app.route('/products/uploadAvatar').post(products.uploadAvatar);
	app.route('/products/insertMassive').post(products.insertMassive);
	app.route('/products/updateMassive').post(products.updateMassive);
	app.route('/products/getProduct').post(products.getProduct);
	app.route('/products/:productId')
		.get(products.read)
		.put(products.update)
		//.put(users.requiresLogin, products.hasAuthorization, products.update)
		.delete(users.requiresLogin, products.hasAuthorization, products.delete);

	// Finish by binding the Product middleware
	app.param('productId', products.productByID);
};