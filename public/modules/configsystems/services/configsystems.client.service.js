'use strict';

//Configsystems service used to communicate Configsystems REST endpoints
angular.module('configsystems').factory('Configsystems', ['$resource',
	function($resource) {
		return $resource('configsystems', { }, {
			update: {
				method: 'PUT'
			}
		});
	}
]);