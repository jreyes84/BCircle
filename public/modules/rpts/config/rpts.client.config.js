'use strict';

// Configuring the Articles module
angular.module('rpts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Rpts', 'rpts', 'dropdown', '/rpts(/create)?');
		// Menus.addSubMenuItem('topbar', 'rpts', 'List Rpts', 'rpts');
		// Menus.addSubMenuItem('topbar', 'rpts', 'New Rpt', 'rpts/create');
	}
]);