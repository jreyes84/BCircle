'use strict';

//Polizas service used to communicate Polizas REST endpoints
angular.module('polizas').factory('Polizas', ['$resource',
	function($resource) {
		return $resource('polizas/:polizaId', { polizaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);