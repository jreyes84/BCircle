'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var documentos = require('../../app/controllers/documentos');

	// Documentos Routes
	app.route('/documentos')
		.get(documentos.list)
		.post(users.requiresLogin, documentos.create)
		.put(documentos.update);
	app.route('/documentos/uploadFile').post(documentos.uploadFile);
	app.route('/documentos/watchFile').post(documentos.watchFile);
	app.route('/documentos/listExpiratedDocuments').post(documentos.listExpiratedDocuments);

	app.route('/documentos/:documentoId')
		.get(documentos.read)
		.put(documentos.update)
		.delete(users.requiresLogin, documentos.hasAuthorization, documentos.delete);

	// Finish by binding the Documento middleware
	app.param('documentoId', documentos.documentoByID);
};