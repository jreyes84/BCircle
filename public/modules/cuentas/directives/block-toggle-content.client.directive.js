'use strict';

angular.module('cuentas').directive('blockToggleContent', [
	function() {
		return {
			restrict: 'A',
			link: function Linker(scope, element, attrs) {
				// Block toggle content directive logic
				// ...
				 element.on('click', function(){
		            var blockContent = element.closest('.block').find('.block-content');
		            
		            if (element.hasClass('active')) {
		                blockContent.slideDown();
		            } else {
		                blockContent.slideUp();
		            }

		            element.toggleClass('active');
		        });
			}
		};
	}
]);