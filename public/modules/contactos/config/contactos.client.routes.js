'use strict';

//Setting up route
angular.module('contactos').config(['$stateProvider',
	function($stateProvider) {
		// Contactos state routing
		$stateProvider.
		state('listContactos', {
			url: '/contactos',
			templateUrl: 'modules/contactos/views/list-contactos.client.view.html'
		}).
		state('createContacto', {
			url: '/contactos/create',
			templateUrl: 'modules/contactos/views/create-contacto.client.view.html'
		}).
		state('viewContacto', {
			url: '/contactos/:contactoId',
			templateUrl: 'modules/contactos/views/list-contactos.client.view.html'
		}).
		state('editContacto', {
			url: '/contactos/:contactoId/edit',
			templateUrl: 'modules/contactos/views/edit-contacto.client.view.html'
		}).
		state('findByCP',{
			url : '/contactos/findByCP'
		});
	}
]);