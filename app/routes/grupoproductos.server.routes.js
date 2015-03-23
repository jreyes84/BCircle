'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var grupoproductos = require('../../app/controllers/grupoproductos');

	// Grupoproductos Routes
	app.route('/grupoproductos')
		.get(grupoproductos.list)
		.post(users.requiresLogin, grupoproductos.create);

	app.route('/grupoproductos/:grupoproductoId')
		.get(grupoproductos.read)
		.put(users.requiresLogin, grupoproductos.hasAuthorization, grupoproductos.update)
		.delete(users.requiresLogin, grupoproductos.hasAuthorization, grupoproductos.delete);

	// Finish by binding the Grupoproducto middleware
	app.param('grupoproductoId', grupoproductos.grupoproductoByID);
};