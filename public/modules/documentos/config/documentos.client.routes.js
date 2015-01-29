'use strict';

//Setting up route
angular.module('documentos').config(['$stateProvider',
	function($stateProvider) {
		// Documentos state routing
		$stateProvider.
		state('listDocumentos', {
			url: '/documentos',
			templateUrl: 'modules/documentos/views/list-documentos.client.view.html'
		}).
		state('createDocumento', {
			url: '/documentos/create',
			templateUrl: 'modules/documentos/views/create-documento.client.view.html'
		}).
		state('viewDocumento', {
			url: '/documentos/:documentoId',
			templateUrl: 'modules/documentos/views/list-documentos.client.view.html'
		}).
		state('editDocumento', {
			url: '/documentos/:documentoId/edit',
			templateUrl: 'modules/documentos/views/edit-documento.client.view.html'
		});
	}
]);