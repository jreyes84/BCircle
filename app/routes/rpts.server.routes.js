'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var rpts = require('../../app/controllers/rpts');

	// Rpts Routes
	app.route('/rpts')
		.get(rpts.list)
		.post(users.requiresLogin, rpts.create);
		
	app.route('/rpts/reporte_1').post(rpts.reporte_1);
	app.route('/rpts/balanceGeneral').post(rpts.balanceGeneral);
	app.route('/rpts/exportToCsv').post(rpts.exportToCsv);

	app.route('/rpts/:rptId')
		.get(rpts.read)
		.put(users.requiresLogin, rpts.hasAuthorization, rpts.update)
		.delete(users.requiresLogin, rpts.hasAuthorization, rpts.delete);

	// Finish by binding the Rpt middleware
	app.param('rptId', rpts.rptByID);
};