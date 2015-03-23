'use strict';

angular.module('promocions').directive('range', [
	function() {
		return {
	        replace: true,
	        restrict: 'A',
	        scope: {
	        	model : '=ngModel',
	            min: '=sliderMin',
	            max: '=sliderMax',
	            step: '=sliderStep',
	            val: '=sliderValue'
	        },
	        link: function(scope, iElement, iAttrs) {
	        	iElement.slider();
	            scope.$watch('slider-min', function() { setValue(); });
	            scope.$watch('slider-max', function() { setValue(); });
	            scope.$watch('slider-step', function() { setValue(); });
	            scope.$watch('slider-val', function() { setValue(); });
	            //scope.$watch(iAttrs.ngModel, function() { setValue(); });

	            function setValue() {
	                if ( angular.isDefined(scope.min) && angular.isDefined(scope.max) && angular.isDefined(scope.step) &&
	                    angular.isDefined(scope.val)
	                ) {
	                    iElement.attr('slider-min', scope.min);
	                    iElement.attr('slider-max', scope.max);
	                    iElement.attr('slider-step', scope.step);
	                    iElement.val(scope.val); 
	                }
	            }

	            function read() {
	                scope.val = iElement.val();
	            }

	            iElement.on('change', function() {
	                scope.$apply(read);
	            });
	        }
	    };
	}
]);