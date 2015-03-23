'use strict';

//Setting up route
angular.module('ventas').config(['$stateProvider',
	function($stateProvider) {
		// Ventas state routing
		$stateProvider.
		state('listVentas', {
			url: '/punto_venta',
			templateUrl: 'modules/ventas/views/list-ventas.client.view.html'
		}).
		state('createVenta', {
			url: '/ventas/create',
			templateUrl: 'modules/ventas/views/create-venta.client.view.html'
		}).
		state('viewVenta', {
			url: '/ventas/:ventaId',
			templateUrl: 'modules/ventas/views/view-venta.client.view.html'
		}).
		state('editVenta', {
			url: '/ventas/:ventaId/edit',
			templateUrl: 'modules/ventas/views/edit-venta.client.view.html'
		});
	}
]);