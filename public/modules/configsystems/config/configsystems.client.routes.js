'use strict';

//Setting up route
angular.module('configsystems').config(['$stateProvider',
	function($stateProvider) {
		// Configsystems state routing
		$stateProvider.
		state('listConfigsystems', {
			url: '/configsystems',
			templateUrl: 'modules/configsystems/views/list-configsystems.client.view.html'
		}).
		state('createConfigsystem', {
			url: '/configsystems/create',
			templateUrl: 'modules/configsystems/views/create-configsystem.client.view.html'
		}).
		state('viewConfigsystem', {
			url: '/configsystems/:configsystemId',
			templateUrl: 'modules/configsystems/views/view-configsystem.client.view.html'
		}).
		state('editConfigsystem', {
			url: '/configsystems/:configsystemId/edit',
			templateUrl: 'modules/configsystems/views/edit-configsystem.client.view.html'
		});
	}
]);