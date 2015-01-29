'use strict';

angular.module('documentos').directive('inputFocus', ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			scope : {
				trigger : '@focus'
			},
			link: function Link(scope, element, attrs) {
				var value = attrs.inputFocus;
				scope.$watch('trigger', function() {
					if (value === 'true') {
						$timeout(function() {
							element[0].focus();
						},100);
					}
				});
			}
		};
	}
]);