'use strict';

angular.module('users').directive('addContactTelephons', [
	function($compile) {
		
		return {
			restrict: 'A',
			//template: '',
			
			link: function Linker(scope, element, attrs) {
				// Add contact telephons directive logic
				// ...
				element.mask('(999) 999-9999? x99999');
			}
		};
	}
]);