'use strict';

//Documentos service used to communicate Documentos REST endpoints
angular.module('documentos').factory('Documentos', ['$resource',
	function($resource) {
		return $resource('documentos/:documentoId', { documentoId: '@_id' }, {
			update: {
				method: 'PUT'
			}
		});
	}
]);