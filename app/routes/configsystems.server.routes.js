'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var configsystems = require('../../app/controllers/configsystems');

	// Configsystems Routes
	app.route('/configsystems')
		.get(configsystems.list)
		.put(configsystems.update)
		.post(users.requiresLogin, configsystems.create);

	app.route('/configsystems/:configsystemId')
		.get(configsystems.read)
		.put(users.requiresLogin, configsystems.hasAuthorization, configsystems.update)
		.delete(users.requiresLogin, configsystems.hasAuthorization, configsystems.delete);

	// Finish by binding the Configsystem middleware
	app.param('configsystemId', configsystems.configsystemByID);
};