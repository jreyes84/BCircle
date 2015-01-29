'use strict';

//Setting up route
angular.module('notas').config(['$stateProvider',
	function($stateProvider) {
		// Notas state routing
		$stateProvider.
		state('listNotas', {
			url: '/notas',
			templateUrl: 'modules/notas/views/list-notas.client.view.html'
		}).
		state('createNota', {
			url: '/notas/create',
			templateUrl: 'modules/notas/views/create-nota.client.view.html'
		}).
		state('viewNota', {
			url: '/notas/:notaId',
			templateUrl: 'modules/notas/views/view-nota.client.view.html'
		}).
		state('editNota', {
			url: '/notas/:notaId/edit',
			templateUrl: 'modules/notas/views/edit-nota.client.view.html'
		});
	}
]);