'use strict';

//Promocions service used to communicate Promocions REST endpoints
angular.module('promocions').factory('Promocions', ['$resource',
	function($resource) {
		return $resource('promocions', { }, {
			update: {
				method: 'PUT'
			}
		});
	}
]);