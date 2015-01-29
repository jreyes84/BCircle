'use strict';

//Setting up route
angular.module('rpts').config(['$stateProvider',
	function($stateProvider) {
		// Rpts state routing
		$stateProvider.
		state('listRpts', {
			url: '/rpts',
			templateUrl: 'modules/rpts/views/list-rpts.client.view.html'
		}).
		state('createRpt', {
			url: '/rpts/create',
			templateUrl: 'modules/rpts/views/create-rpt.client.view.html'
		}).
		state('viewRpt', {
			url: '/rpts/:rptId',
			templateUrl: 'modules/rpts/views/view-rpt.client.view.html'
		}).
		state('editRpt', {
			url: '/rpts/:rptId/edit',
			templateUrl: 'modules/rpts/views/edit-rpt.client.view.html'
		});
	}
]);