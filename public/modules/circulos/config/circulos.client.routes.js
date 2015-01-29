'use strict';

//Setting up route
angular.module('circulos').config(['$stateProvider',
	function($stateProvider) {
		// Circulos state routing
		$stateProvider.
		state('listCirculos', {
			url: '/circulos',
			templateUrl: 'modules/circulos/views/list-circulos.client.view.html'
		}).
		state('createCirculo', {
			url: '/circulos/create',
			templateUrl: 'modules/circulos/views/create-circulo.client.view.html'
		}).
		state('viewCirculo', {
			url: '/circulos/:circuloId',
			templateUrl: 'modules/circulos/views/view-circulo.client.view.html'
		}).
		state('editCirculo', {
			url: '/circulos/:circuloId/edit',
			templateUrl: 'modules/circulos/views/edit-circulo.client.view.html'
		});
	}
]);