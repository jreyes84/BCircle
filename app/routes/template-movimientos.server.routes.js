'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var templateMovimientos = require('../../app/controllers/template-movimientos');

	// Template movimientos Routes
	app.route('/template-movimientos')
		.get(templateMovimientos.list)
		.put(templateMovimientos.update)
		.post(users.requiresLogin, templateMovimientos.create);

	app.route('/template-movimientos/listTemplatesAndCuentas').post(templateMovimientos.listTemplatesAndCuentas);
	app.route('/template-movimientos/listCuentasFromTemplates').post(templateMovimientos.listCuentasFromTemplates);
	

	app.route('/template-movimientos/:templateMovimientoId')
		.get(templateMovimientos.read)
		.put(users.requiresLogin, templateMovimientos.hasAuthorization, templateMovimientos.update)
		.delete(users.requiresLogin, templateMovimientos.hasAuthorization, templateMovimientos.delete);

	// Finish by binding the Template movimiento middleware
	app.param('templateMovimientoId', templateMovimientos.templateMovimientoByID);
};