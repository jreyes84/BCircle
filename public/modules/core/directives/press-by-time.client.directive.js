'use strict';

angular.module('core').directive('pressByTime', [ '$timeout', '$window',
	function($timeout, $window) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				var clickTimer, clickEvent, onLongClick;

				element.bind('mousedown', function(event){
					if (clickTimer) {
				        $window.clearTimeout(clickTimer);
				        clickEvent = null;
				    }        
				    clickTimer = window.setTimeout(onLongClick, 900);
				    clickEvent = event;
				});

				element.bind('mouseup', function(event){
					$window.clearTimeout(clickTimer);
					clickEvent = null;
				});

				onLongClick = function() {
					scope.$apply(scope.$parent.onLongClick);               
				};
			}
		};
	}
]);