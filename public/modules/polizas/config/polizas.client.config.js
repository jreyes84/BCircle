'use strict';

// Configuring the Articles module
angular.module('polizas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Polizas', 'polizas', 'dropdown', '/polizas(/create)?');
		//Menus.addSubMenuItem('topbar', 'polizas', 'List Polizas', 'polizas');
		//Menus.addSubMenuItem('topbar', 'polizas', 'New Poliza', 'polizas/create');
	}
]);