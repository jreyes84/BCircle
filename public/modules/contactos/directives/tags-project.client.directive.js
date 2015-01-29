'use strict';

angular.module('contactos').directive('tagsProject', [
	function($compile) {
		
		return {
			restrict: 'A',
			//template: '',
			
			link: function Linker(scope, element, attrs) {
				function onAddTag(){
					scope.$apply(attrs.newTagProject);
				}
				function onRemoveTag(){
					scope.$apply(attrs.deleteTagProject);
				}
				// Watch for changes in text field
				
				scope.$watch(attrs.ngModel, function(value) {
					if (value !== undefined) {
						var tempEl = element.find('.input-tag').append(value );
						scope.inputWidth = tempEl.width() + 5;
						tempEl.remove();
					}
				});

				// Watch for changes in text field
				element.bind('keydown', function(e) {
					if (e.which === 9) {
						e.preventDefault();
					}

					if (e.which === 8) {
						scope.$apply(attrs.deleteTagProject);
					}
					if(e.which === 13)
					{
						e.preventDefault();
					}
				});

				element.bind('keyup', function(e) {
					var key = e.which;
					// Tab or Enter pressed 
					if (key === 9 || key === 13) {
						e.preventDefault();	
						scope.$apply(attrs.newTagProject);
					}
				});
				
			}
		};
	}
]);