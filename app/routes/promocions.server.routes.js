'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var promocions = require('../../app/controllers/promocions');

	// Promocions Routes
	app.route('/promocions')
		.get(promocions.list)
		.post(users.requiresLogin, promocions.create)
		.put(promocions.update);
	app.route('/promotionById').post(promocions.promotionById);
	app.route('/promocions/:promocionId')
		.get(promocions.read)
		.put(users.requiresLogin, promocions.hasAuthorization, promocions.update)
		.delete(users.requiresLogin, promocions.hasAuthorization, promocions.delete);

	// Finish by binding the Promocion middleware
	app.param('promocionId', promocions.promocionByID);
};