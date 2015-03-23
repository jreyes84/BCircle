'use strict';

//Setting up route
angular.module('promocions').config(['$stateProvider',
	function($stateProvider) {
		// Promocions state routing
		$stateProvider.
		state('listPromocions', {
			url: '/promocions',
			templateUrl: 'modules/promocions/views/list-promocions.client.view.html'
		}).
		state('createPromocion', {
			url: '/promocions/create',
			templateUrl: 'modules/promocions/views/create-promocion.client.view.html'
		}).
		state('viewPromocion', {
			url: '/promocions/:promocionId',
			templateUrl: 'modules/promocions/views/view-promocion.client.view.html'
		}).
		state('editPromocion', {
			url: '/promocions/:promocionId/edit',
			templateUrl: 'modules/promocions/views/edit-promocion.client.view.html'
		});
	}
]);