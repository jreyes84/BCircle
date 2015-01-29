'use strict';

// Configuring the Articles module
angular.module('cuentas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*Menus.addMenuItem('topbar', 'Cuentas', 'cuentas', 'dropdown', '/cuentas(/create)?');
		Menus.addSubMenuItem('topbar', 'cuentas', 'List Cuentas', 'cuentas');
		Menus.addSubMenuItem('topbar', 'cuentas', 'New Cuenta', 'cuentas/create');*/
	}
]);