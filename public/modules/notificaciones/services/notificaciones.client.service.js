'use strict';

//Notificaciones service used to communicate Notificaciones REST endpoints
angular.module('notificaciones').factory('Notificaciones', ['$resource',
	function($resource) {
		return $resource('notificaciones', { }, {
			update: {
				method: 'PUT'
			}
		});
	}
]);