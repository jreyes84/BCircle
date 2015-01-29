'use strict';

// Configuring the Articles module
angular.module('movimientos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Movimientos', 'movimientos', 'dropdown', '/movimientos(/create)?');
		//Menus.addSubMenuItem('topbar', 'movimientos', 'List Movimientos', 'movimientos');
		//Menus.addSubMenuItem('topbar', 'movimientos', 'New Movimiento', 'movimientos/create');
	}
]);