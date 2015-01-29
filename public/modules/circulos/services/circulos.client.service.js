'use strict';

//Circulos service used to communicate Circulos REST endpoints
angular.module('circulos').factory('Circulos', ['$resource',
	function($resource) {
		return $resource('circulos', { }, {
			update: {
				method: 'PUT'
			}
		});
	}
]);