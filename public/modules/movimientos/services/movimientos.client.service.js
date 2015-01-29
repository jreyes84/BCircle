'use strict';

//Movimientos service used to communicate Movimientos REST endpoints
angular.module('movimientos').factory('Movimientos', ['$resource',
	function($resource) {
		return $resource('movimientos/:movimientoId', { movimientoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);