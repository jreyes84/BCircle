'use strict';

angular.module('core').directive('alertNotification', ['$window',
	function($window) {
		return {
			restrict: 'A',
			link: function link(scope, element, attrs) {
				scope.$watch(attrs.ngModel, function(value) {
					var title = attrs.alerttitle;
					var content = attrs.alertcontent;
					var buttons = attrs.alertbuttons;
					var functions = attrs.alertmethods;

					if( value !== undefined ){
						$window.$.SmartMessageBox({
							title : title,
							content : content,
							buttons : buttons
						}, function(ButtonPressed) {
							var splitButtons = buttons.split('[');
							var splitFunctions = functions.split('-');
							var realButtons = [];
							angular.forEach(splitButtons, function(val,key){
								if(key !== 0){
									realButtons.push(val.replace(']',''));
								}
							});
							angular.forEach(realButtons, function(value,key){
								if(value === ButtonPressed){
									scope.$apply(splitFunctions[key]);
								}
							});
						});	
					}
				});	  
			}
		};
	}
]);