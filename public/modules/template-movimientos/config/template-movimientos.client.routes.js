'use strict';

//Setting up route
angular.module('template-movimientos').config(['$stateProvider',
	function($stateProvider) {
		// Template movimientos state routing
		$stateProvider.
		state('listTemplateMovimientos', {
			url: '/template-movimientos',
			templateUrl: 'modules/template-movimientos/views/list-template-movimientos.client.view.html'
		}).
		state('createTemplateMovimiento', {
			url: '/template-movimientos/create',
			templateUrl: 'modules/template-movimientos/views/create-template-movimiento.client.view.html'
		}).
		state('viewTemplateMovimiento', {
			url: '/template-movimientos/:templateMovimientoId',
			templateUrl: 'modules/template-movimientos/views/view-template-movimiento.client.view.html'
		}).
		state('editTemplateMovimiento', {
			url: '/template-movimientos/:templateMovimientoId/edit',
			templateUrl: 'modules/template-movimientos/views/edit-template-movimiento.client.view.html'
		});
	}
]);