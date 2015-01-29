'use strict';

// Configuring the Articles module
angular.module('notas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Notas', 'notas', 'dropdown', '/notas(/create)?');
		// Menus.addSubMenuItem('topbar', 'notas', 'List Notas', 'notas');
		// Menus.addSubMenuItem('topbar', 'notas', 'New Nota', 'notas/create');
	}
]);