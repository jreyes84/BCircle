'use strict';

//Rpts service used to communicate Rpts REST endpoints
angular.module('rpts').factory('Rpts', ['$resource',
	function($resource) {
		return $resource('rpts/:rptId', { rptId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);