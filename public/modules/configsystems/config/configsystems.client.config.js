'use strict';

// Configuring the Articles module
angular.module('configsystems').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Configsystems', 'configsystems', 'dropdown', '/configsystems(/create)?');
		// Menus.addSubMenuItem('topbar', 'configsystems', 'List Configsystems', 'configsystems');
		// Menus.addSubMenuItem('topbar', 'configsystems', 'New Configsystem', 'configsystems/create');
	}
]);