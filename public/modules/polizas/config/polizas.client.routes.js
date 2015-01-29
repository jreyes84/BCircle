'use strict';

//Setting up route
angular.module('polizas').config(['$stateProvider',
	function($stateProvider) {
		// Polizas state routing
		$stateProvider.
		state('listPolizas', {
			url: '/polizas',
			templateUrl: 'modules/polizas/views/list-polizas.client.view.html'
		}).
		state('createPoliza', {
			url: '/polizas/create',
			templateUrl: 'modules/polizas/views/create-poliza.client.view.html'
		}).
		state('viewPoliza', {
			url: '/polizas/:polizaId',
			templateUrl: 'modules/polizas/views/view-poliza.client.view.html'
		}).
		state('editPoliza', {
			url: '/polizas/:polizaId/edit',
			templateUrl: 'modules/polizas/views/edit-poliza.client.view.html'
		});
	}
]);