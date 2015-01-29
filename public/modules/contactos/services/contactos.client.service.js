'use strict';

//Contactos service used to communicate Contactos REST endpoints
angular.module('contactos').factory('Contactos', ['$resource',
	function($resource) {
		return $resource('contactos/:contactoId', {contactoId:'@_id'}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);