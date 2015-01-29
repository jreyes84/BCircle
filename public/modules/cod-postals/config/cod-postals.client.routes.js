'use strict';

//Setting up route
angular.module('cod-postals').config(['$stateProvider',
	function($stateProvider) {
		// Cod postals state routing
		$stateProvider.
		state('listCodPostals', {
			url: '/cod-postals',
			templateUrl: 'modules/cod-postals/views/list-cod-postals.client.view.html'
		}).
		state('createCodPostal', {
			url: '/cod-postals/create',
			templateUrl: 'modules/cod-postals/views/create-cod-postal.client.view.html'
		}).
		state('viewCodPostal', {
			url: '/cod-postals/:codPostalId',
			templateUrl: 'modules/cod-postals/views/view-cod-postal.client.view.html'
		}).
		state('editCodPostal', {
			url: '/cod-postals/:codPostalId/edit',
			templateUrl: 'modules/cod-postals/views/edit-cod-postal.client.view.html'
		});
	}
]);