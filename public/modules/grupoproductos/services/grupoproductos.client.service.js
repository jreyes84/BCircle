'use strict';

//Grupoproductos service used to communicate Grupoproductos REST endpoints
angular.module('grupoproductos').factory('Grupoproductos', ['$resource',
	function($resource) {
		return $resource('grupoproductos/:grupoproductoId', { grupoproductoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);