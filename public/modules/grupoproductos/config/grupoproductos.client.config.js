'use strict';

// Configuring the Articles module
angular.module('grupoproductos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Grupoproductos', 'grupoproductos', 'dropdown', '/grupoproductos(/create)?');
		// Menus.addSubMenuItem('topbar', 'grupoproductos', 'List Grupoproductos', 'grupoproductos');
		// Menus.addSubMenuItem('topbar', 'grupoproductos', 'New Grupoproducto', 'grupoproductos/create');
	}
]);