'use strict';

angular.module('cuentas').directive('confirmAlert', [
	function() {
		return {
			priority: -1,
      		restrict: 'A',
			link: function (scope, element, attrs) {
				var msg = attrs.confirmAlert || 'Esta seguro?';

		        var clickAction = attrs.ngClick;
		        attrs.ngClick = '';
		        element.bind('click', function(event) {
		          if (window.confirm(msg)) {
		            	scope.$eval(clickAction);
		          }else{
		          	return false;
		          }
		        });
			}
		};
	}
]);