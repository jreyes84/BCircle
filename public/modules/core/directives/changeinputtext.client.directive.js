'use strict';

angular.module('core').directive('changeinputtext', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				scope.$watch(attrs.ngModel, function(value) {
					
				});
			}
		};
	}
]);