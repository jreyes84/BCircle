'use strict';

// Configuring the Articles module
angular.module('historials').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Historials', 'historials', 'dropdown', '/historials(/create)?');
		// Menus.addSubMenuItem('topbar', 'historials', 'List Historials', 'historials');
		// Menus.addSubMenuItem('topbar', 'historials', 'New Historial', 'historials/create');
	}
]);