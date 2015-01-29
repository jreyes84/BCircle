'use strict';

angular.module('cuentas').directive('focusInput', [
	function() {
		return {
			restrict: 'A',
			link: function Linker(scope, element, attrs, model) {

				element.bind('keyup', function(e) {
					var key = e.which;
					// Tab or Enter pressed 
					if (key === 9 || key === 13) {
						e.preventDefault();	
						element[0].focus();
					}
				});

				element.bind('blur', function(e){
					//console.log('onBlur');
				});
			}
		};
	}
]);