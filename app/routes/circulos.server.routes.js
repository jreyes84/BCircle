'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var circulos = require('../../app/controllers/circulos');

	// Circulos Routes
	app.route('/circulos')
		.get(circulos.list)
		.post(users.requiresLogin, circulos.create)
		.put(circulos.update);

	app.route('/circulos/:circuloId')
		.get(circulos.read)
		.put(users.requiresLogin, circulos.hasAuthorization, circulos.update)
		.delete(users.requiresLogin, circulos.hasAuthorization, circulos.delete);

	// Finish by binding the Circulo middleware
	app.param('circuloId', circulos.circuloByID);
};