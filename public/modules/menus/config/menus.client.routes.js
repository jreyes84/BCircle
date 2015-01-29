'use strict';

//Setting up route
angular.module('menus').config(['$stateProvider',
	function($stateProvider) {
		// Menus state routing
		$stateProvider.
		state('list-menus', {
			url: '/menus/menulist',
			templateUrl: 'modules/menus/views/list-menus.client.view.html'
		});
	}
]);