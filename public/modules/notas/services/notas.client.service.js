'use strict';

//Notas service used to communicate Notas REST endpoints
angular.module('notas').factory('Notas', ['$resource',
	function($resource) {
		return $resource('notas/:notaId', { notaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);