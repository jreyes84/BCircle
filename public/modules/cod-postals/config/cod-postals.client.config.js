'use strict';

// Configuring the Articles module
angular.module('cod-postals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Cod postals', 'cod-postals', 'dropdown', '/cod-postals(/create)?');
		//Menus.addSubMenuItem('topbar', 'cod-postals', 'List Cod postals', 'cod-postals');
		//Menus.addSubMenuItem('topbar', 'cod-postals', 'New Cod postal', 'cod-postals/create');
	}
]);