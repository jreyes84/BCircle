'use strict';

//Chats service used to communicate Chats REST endpoints
angular.module('chats').factory('Chats', ['$resource',
	function($resource) {
		return $resource('chats', { 
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
///:chatId chatId: '@_id'