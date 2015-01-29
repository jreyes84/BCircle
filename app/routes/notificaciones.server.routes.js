'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var notificaciones = require('../../app/controllers/notificaciones');

	// Notificaciones Routes
	app.route('/notificaciones')
		.get(notificaciones.list)
		.post(users.requiresLogin, notificaciones.create);
	app.route('/notificaciones/thisNotyHasBeenSeen').post(notificaciones.thisNotyHasBeenSeen);

	app.route('/notificaciones/:notificacioneId')
		.get(notificaciones.read)
		.put(users.requiresLogin, notificaciones.hasAuthorization, notificaciones.update)
		.delete(users.requiresLogin, notificaciones.hasAuthorization, notificaciones.delete);

	// Finish by binding the Notificacione middleware
	app.param('notificacioneId', notificaciones.notificacioneByID);
};