'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var codPostals = require('../../app/controllers/cod-postals');

	// Cod postals Routes
	app.route('/cod-postals')
	.get(codPostals.list)
	.post(users.requiresLogin, codPostals.create);

	app.route('/cod-postals/findByCP').post(codPostals.findByCP);

	app.route('/cod-postals/:codPostalId')
		.get(codPostals.read)
		.put(users.requiresLogin, codPostals.hasAuthorization, codPostals.update)
		.delete(users.requiresLogin, codPostals.hasAuthorization, codPostals.delete);

	// Finish by binding the Cod postal middleware
	app.param('codPostalId', codPostals.codPostalByID);
};