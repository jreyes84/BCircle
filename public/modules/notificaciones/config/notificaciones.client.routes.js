'use strict';

//Setting up route
angular.module('notificaciones').config(['$stateProvider',
	function($stateProvider) {
		// Notificaciones state routing
		$stateProvider.
		state('listNotificaciones', {
			url: '/notificaciones',
			templateUrl: 'modules/notificaciones/views/list-notificaciones.client.view.html'
		}).
		state('createNotificacione', {
			url: '/notificaciones/create',
			templateUrl: 'modules/notificaciones/views/create-notificacione.client.view.html'
		}).
		state('viewNotificacione', {
			url: '/notificaciones/:notificacioneId',
			templateUrl: 'modules/notificaciones/views/view-notificacione.client.view.html'
		}).
		state('editNotificacione', {
			url: '/notificaciones/:notificacioneId/edit',
			templateUrl: 'modules/notificaciones/views/edit-notificacione.client.view.html'
		});
	}
]);