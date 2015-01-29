'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var movimientos = require('../../app/controllers/movimientos');

	// Movimientos Routes
	app.route('/movimientos')
		.get(movimientos.list)
		.post(users.requiresLogin, movimientos.create);

	app.route('/movimientos/:movimientoId')
		.get(movimientos.read)
		.put(users.requiresLogin, movimientos.hasAuthorization, movimientos.update)
		.delete(users.requiresLogin, movimientos.hasAuthorization, movimientos.delete);

	// Finish by binding the Movimiento middleware
	app.param('movimientoId', movimientos.movimientoByID);
};