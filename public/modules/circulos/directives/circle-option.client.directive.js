'use strict';

angular.module('circulos').directive('circleOption', [
	function() {
		return {
			restrict: 'A',
			link: function Link(scope, element, attrs) {
				element.find('ul > li').bind('click', function(e) {
					console.log('Inside ->',element);
					element.addClass('open');
					scope.$apply();
				});
			}
		};
	}
]);