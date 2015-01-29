'use strict';

// Configuring the Articles module
angular.module('calendars').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('calendar', 'Calendars', 'calendars', 'dropdown', '/calendars(/create)?');
		//Menus.addSubMenuItem('calendar', 'calendars', 'List Calendars', 'calendars');
		//Menus.addSubMenuItem('calendar', 'calendars', 'New Calendar', 'calendars/create');
	}
]);