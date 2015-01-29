'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var contactos = require('../../app/controllers/contactos');

	// Contactos Routes
	app.route('/contactos')
		.get(contactos.list)
		.post(users.requiresLogin, contactos.create)
		.put(contactos.update);
	app.route('/contactos/uploadAvatar').post(contactos.uploadAvatar);
	app.route('/contactos/contactlist').post(contactos.list);
	app.route('/contactos/listByParam').post(contactos.listByParam);
	app.route('/contactos/findByFirstLastAndComercialName').post(contactos.findByFirstLastAndComercialName);
	app.route('/contactos/deletecontacto').post(contactos.delete);
	app.route('/contactos/:contactoId')
		.get(contactos.read)
		.put(contactos.update)
		.delete(users.requiresLogin, contactos.hasAuthorization, contactos.delete);
	app.route('/contactos/findById').post(contactos.findById);


	// Finish by binding the Contacto middleware
	app.param('contactoId', contactos.contactoByID);
};