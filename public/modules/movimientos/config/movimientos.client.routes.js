'use strict';

//Setting up route
angular.module('movimientos').config(['$stateProvider',
	function($stateProvider) {
		// Movimientos state routing
		$stateProvider.
		state('listMovimientos', {
			url: '/movimientos',
			templateUrl: 'modules/movimientos/views/list-movimientos.client.view.html'
		}).
		state('createMovimiento', {
			url: '/movimientos/create',
			templateUrl: 'modules/movimientos/views/create-movimiento.client.view.html'
		}).
		state('viewMovimiento', {
			url: '/movimientos/:movimientoId',
			templateUrl: 'modules/movimientos/views/view-movimiento.client.view.html'
		}).
		state('editMovimiento', {
			url: '/movimientos/:movimientoId/edit',
			templateUrl: 'modules/movimientos/views/edit-movimiento.client.view.html'
		});
	}
]);