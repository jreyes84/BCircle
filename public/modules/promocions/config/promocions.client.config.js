'use strict';

// Configuring the Articles module
angular.module('promocions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Promocions', 'promocions', 'dropdown', '/promocions(/create)?');
		// Menus.addSubMenuItem('topbar', 'promocions', 'List Promocions', 'promocions');
		// Menus.addSubMenuItem('topbar', 'promocions', 'New Promocion', 'promocions/create');
	}
]);