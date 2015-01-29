'use strict';

//Template movimientos service used to communicate Template movimientos REST endpoints
angular.module('template-movimientos').factory('TemplateMovimientos', ['$resource',
	function($resource) {
		return $resource('template-movimientos', { }, {
			update: {
				method: 'PUT'
			}
		});
	}
]);