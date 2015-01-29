'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var notas = require('../../app/controllers/notas');

	// Notas Routes
	app.route('/notas')
		.get(notas.list)
		.post(users.requiresLogin, notas.create);

	app.route('/notas/:notaId')
		.get(notas.read)
		.put(users.requiresLogin, notas.hasAuthorization, notas.update)
		.delete(users.requiresLogin, notas.hasAuthorization, notas.delete);

	// Finish by binding the Nota middleware
	app.param('notaId', notas.notaByID);
};