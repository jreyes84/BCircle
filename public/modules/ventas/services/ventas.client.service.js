'use strict';

//Ventas service used to communicate Ventas REST endpoints
angular.module('ventas').factory('Ventas', ['$resource',
	function($resource) {
		return $resource('ventas/:ventaId', { ventaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);