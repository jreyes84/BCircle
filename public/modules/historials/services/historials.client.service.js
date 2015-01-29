'use strict';

//Historials service used to communicate Historials REST endpoints
angular.module('historials').factory('Historials', ['$resource',
	function($resource) {
		return $resource('historials', { }, {
			update: {
				method: 'PUT'
			}
		});
	}
]);