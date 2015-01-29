'use strict';

// Configuring the Articles module
angular.module('circulos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Circulos', 'circulos', 'dropdown', '/circulos(/create)?');
		// Menus.addSubMenuItem('topbar', 'circulos', 'List Circulos', 'circulos');
		// Menus.addSubMenuItem('topbar', 'circulos', 'New Circulo', 'circulos/create');
	}
]);