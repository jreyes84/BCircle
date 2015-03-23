'use strict';

angular.module('core').directive('notifications', [ '$window',
	function($window) {
		return {
			restrict: 'A',
			link: function Link(scope, element, attrs) {
				scope.$watch(attrs.ngModel, function(value) {
					var title = attrs.title;
					var content = attrs.content;
					var widthBox = attrs.size;
					var color = attrs.color;
					var icon = attrs.icon;

					if(value !== undefined){
						$window.$.smallBox({
							title : title,
							content : content,
							widthBox: widthBox,
							color : color,
							iconSmall : icon,
							timeout : 4000
						});
					}  
				});	  	
			}
		};
	}
]);