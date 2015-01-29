'use strict';

//Setting up route
angular.module('cuentas').config(['$stateProvider',
	function($stateProvider) {
		// Cuentas state routing
		$stateProvider.
		state('listCuentas', {
			url: '/cuentas',
			templateUrl: 'modules/cuentas/views/list-cuentas.client.view.html'
		}).
		state('deleteCuenta',{
			url : '/cuentas/delete'
		}).
		state('createCuenta', {
			url: '/cuentas/create',
			templateUrl: 'modules/cuentas/views/create-cuenta.client.view.html'
		}).
		state('viewCuenta', {
			url: '/cuentas/:cuentaId',
			templateUrl: 'modules/cuentas/views/view-cuenta.client.view.html'
		}).
		state('editCuenta', {
			url: '/cuentas/:cuentaId/edit',
			templateUrl: 'modules/cuentas/views/edit-cuenta.client.view.html'
		});
	}
]);