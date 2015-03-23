'use strict';

// Configuring the Articles module
angular.module('ventas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Ventas', 'ventas', 'dropdown', '/ventas(/create)?');
		// Menus.addSubMenuItem('topbar', 'ventas', 'List Ventas', 'ventas');
		// Menus.addSubMenuItem('topbar', 'ventas', 'New Venta', 'ventas/create');
	}
]);