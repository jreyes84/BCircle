'use strict';

// Configuring the Articles module
angular.module('documentos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Documentos', 'documentos', 'dropdown', '/documentos(/create)?');
		//Menus.addSubMenuItem('topbar', 'documentos', 'List Documentos', 'documentos');
		//Menus.addSubMenuItem('topbar', 'documentos', 'New Documento', 'documentos/create');
	}
]);