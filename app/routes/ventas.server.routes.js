'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var ventas = require('../../app/controllers/ventas');

	// Ventas Routes
	app.route('/ventas')
		.get(ventas.list)
		.post(users.requiresLogin, ventas.create);

	app.route('/ventas/:ventaId')
		.get(ventas.read)
		.put(users.requiresLogin, ventas.hasAuthorization, ventas.update)
		.delete(users.requiresLogin, ventas.hasAuthorization, ventas.delete);

	// Finish by binding the Venta middleware
	app.param('ventaId', ventas.ventaByID);
};