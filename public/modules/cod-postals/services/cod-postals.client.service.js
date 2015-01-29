'use strict';

//Cod postals service used to communicate Cod postals REST endpoints
angular.module('cod-postals').factory('CodPostals', ['$resource',
	function($resource) {
		return $resource('cod-postals/:codPostalId', { codPostalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);