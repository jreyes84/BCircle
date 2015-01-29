'use strict';

// Configuring the Articles module
angular.module('contactos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Contactos', 'contactos', 'dropdown', '/contactos(/create)?');
		//Menus.addSubMenuItem('topbar', 'contactos', 'List Contactos', 'contactos');
		//Menus.addSubMenuItem('topbar', 'contactos', 'New Contacto', 'contactos/create');
	}
]);