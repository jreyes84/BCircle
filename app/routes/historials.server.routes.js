'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var historials = require('../../app/controllers/historials');

	// Historials Routes
	app.route('/historials')
		.get(historials.list)
		.post(users.requiresLogin, historials.create);
	
	app.route('/historials/listById').post(historials.listById);
	// app.route('/historials/:historialId')
	// 	.get(historials.read)
	// 	.put(users.requiresLogin, historials.hasAuthorization, historials.update)
	// 	.delete(users.requiresLogin, historials.hasAuthorization, historials.delete);

	// Finish by binding the Historial middleware
	app.param('historialId', historials.historialByID);
};