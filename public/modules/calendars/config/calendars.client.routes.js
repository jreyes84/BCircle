'use strict';

//Setting up route
angular.module('calendars').config(['$stateProvider',
	function($stateProvider) {
		// Calendars state routing
		$stateProvider.
		state('listCalendars', {
			url: '/calendars',
			templateUrl: 'modules/calendars/views/list-calendars.client.view.html'
		}).
		state('createCalendar', {
			url: '/calendars/create',
			templateUrl: 'modules/calendars/views/create-calendar.client.view.html'
		}).
		state('viewCalendar', {
			url: '/calendars/:calendarId',
			templateUrl: 'modules/calendars/views/view-calendar.client.view.html'
		}).
		state('editCalendar', {
			url: '/calendars/:calendarId/edit',
			templateUrl: 'modules/calendars/views/edit-calendar.client.view.html'
		});
	}
]);