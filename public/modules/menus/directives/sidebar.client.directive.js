'use strict';

angular.module('menus').directive('sidebar', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				// Animation Speed, change the values for different results
		        var upSpeed     = 250;
		        var downSpeed   = 250;

		        // Primary Accordion functionality
		        element.on('click',function(){
		            var link = this;
		            if (element.parent().hasClass('active') !== true) {
		                if (element.hasClass('open')) {
		                    element.removeClass('open').next().slideUp(upSpeed, function(){
		                    });
		                }
		                else {
		                    element.removeClass('open').next().slideUp(upSpeed);
		                    element.addClass('open').next().slideDown(downSpeed, function(){
		                    });
		                }
		            }
		            return false;
		        });
			}
		};
	}
]);