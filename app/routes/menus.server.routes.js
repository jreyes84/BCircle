'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var menus = require('../../app/controllers/menus');

	// Menus Routes
 
	app.route('/menus')
		.get(menus.list)
		.post(users.requiresLogin, menus.create)
		.put(menus.update);
	
	app.route('/menus/myMenulist').get(menus.myMenulist);

	app.route('/menus/:menuId')
		.get(menus.read)
		.put(users.requiresLogin, menus.hasAuthorization, menus.update)
		.delete(users.requiresLogin, menus.hasAuthorization, menus.delete);
	// Finish by binding the Menu middleware
	app.param('menuId', menus.menuByID);
};