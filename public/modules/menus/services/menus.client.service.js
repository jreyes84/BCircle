'use strict';

//Menus service used to communicate Menus REST endpoints
angular.module('menus').factory('Menus', ['$resource',
	function($resource) {
		return $resource('menus', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);