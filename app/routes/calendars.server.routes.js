'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var calendars = require('../../app/controllers/calendars');

	// Calendars Routes
	app.route('/calendars')
		.get(calendars.list)
		.post(users.requiresLogin, calendars.create)
		.put(calendars.update);
	app.route('/calendars/list').post(calendars.list);
	app.route('/calendars/listInvitations').post(calendars.listInvitations);
	app.route('/calendars/insertMassive').post(calendars.insertMassive);
	app.route('/calendars/sendEmailToUsers').post(calendars.sendEmailToUsers);
	app.route('/calendars/delete').post(calendars.delete);
	app.route('/calendars/:calendarId')
		.get(calendars.read)
		.put(users.requiresLogin, calendars.hasAuthorization, calendars.update);

	// Finish by binding the Calendar middleware
	app.param('calendarId', calendars.calendarByID);
};