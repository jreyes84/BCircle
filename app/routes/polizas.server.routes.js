'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var polizas = require('../../app/controllers/polizas');

	// Polizas Routes
	app.route('/polizas')
		.get(polizas.list)
		.post(users.requiresLogin, polizas.create);
	
	app.route('/polizas/:polizaId')
		.get(polizas.read)
		.put(users.requiresLogin, polizas.hasAuthorization, polizas.update)
		.delete(users.requiresLogin, polizas.hasAuthorization, polizas.delete);

	// Finish by binding the Poliza middleware
	app.param('polizaId', polizas.polizaByID);
};