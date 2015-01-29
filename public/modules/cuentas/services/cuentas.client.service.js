'use strict';

//Cuentas service used to communicate Cuentas REST endpoints
angular.module('cuentas').factory('Cuentas', ['$resource',
	function($resource) {
		return $resource('cuentas', { }, {
			update: {
				method: 'PUT'
			},
			delete: {
				method: 'DELETE'
			}
		});
	}
]);