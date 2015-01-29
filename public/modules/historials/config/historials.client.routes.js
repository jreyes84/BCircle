'use strict';

//Setting up route
angular.module('historials').config(['$stateProvider',
	function($stateProvider) {
		// Historials state routing
		$stateProvider.
		state('listHistorials', {
			url: '/historials',
			templateUrl: 'modules/historials/views/list-historials.client.view.html'
		}).
		state('createHistorial', {
			url: '/historials/create',
			templateUrl: 'modules/historials/views/list-historials.client.view.html'
		}).
		state('viewHistorial', {
			url: '/historials/:historialId',
			templateUrl: 'modules/historials/views/list-historials.client.view.html'
		}).
		state('editHistorial', {
			url: '/historials/:historialId/edit',
			templateUrl: 'modules/historials/views/list-historials.client.view.html'
		});
	}
]);