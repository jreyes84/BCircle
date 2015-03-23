'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var cuentas = require('../../app/controllers/cuentas');

	// Cuentas Routes
	app.route('/cuentas')
		.get(cuentas.list)
		.post(users.requiresLogin, cuentas.create)
		.put(cuentas.update)
		.delete(cuentas.delete);
	app.route('/cuentas/listdetalle').post(cuentas.listDetalle);
	app.route('/cuentas/delete').post(cuentas.delete);
	app.route('/cuentas/listAPC').post(cuentas.listAPC);
	app.route('/cuentas/listAccountsByCircle').post(cuentas.listAccountsByCircle);

	app.route('/cuentas/:cuentaId')
		.get(cuentas.read)
		.put(users.requiresLogin, cuentas.hasAuthorization, cuentas.update)
		.delete(users.requiresLogin, cuentas.hasAuthorization, cuentas.delete);

	// Finish by binding the Cuenta middleware
	app.param('cuentaId', cuentas.cuentaByID);
};