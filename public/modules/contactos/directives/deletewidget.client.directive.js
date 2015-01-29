'use strict';

angular.module('contactos').directive('deletewidget', [ 
	function() {
		return {
			restrict: 'A',
			link: function Link(scope, element, attrs) {
				var msg = attrs.msg || 'Esta seguro?';
				var clickAction = attrs.ngClick;
				
				element.find('.btn').bind('click', function(event) {
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