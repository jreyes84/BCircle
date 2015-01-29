'use strict';

angular.module('core').directive('tooltips', [ '$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function Link(scope, element, attrs) {

				// $timeout(function(){
				// 	element.tooltip({container: 'body', animation: true});
				// },100);	
			}
		};
	}
]);