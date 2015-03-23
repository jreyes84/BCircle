'use strict';

//Setting up route
angular.module('grupoproductos').config(['$stateProvider',
	function($stateProvider) {
		// Grupoproductos state routing
		$stateProvider.
		state('listGrupoproductos', {
			url: '/grupoproductos',
			templateUrl: 'modules/grupoproductos/views/list-grupoproductos.client.view.html'
		}).
		state('createGrupoproducto', {
			url: '/grupoproductos/create',
			templateUrl: 'modules/grupoproductos/views/create-grupoproducto.client.view.html'
		}).
		state('viewGrupoproducto', {
			url: '/grupoproductos/:grupoproductoId',
			templateUrl: 'modules/grupoproductos/views/view-grupoproducto.client.view.html'
		}).
		state('editGrupoproducto', {
			url: '/grupoproductos/:grupoproductoId/edit',
			templateUrl: 'modules/grupoproductos/views/edit-grupoproducto.client.view.html'
		});
	}
]);