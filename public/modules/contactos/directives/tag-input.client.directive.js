'use strict';

angular.module('contactos').directive('tagInput', [
	function() {
		return {
			restrict: 'A',
			link: function Linker(scope, element, attrs) {
				var msg = attrs.confirmAlert || 'Estas seguro?';

				function onAddTag(){
					scope.$apply(attrs.newTag);
				}
				function onRemoveTag(){
					scope.$apply(attrs.deleteTag);
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
						var length = element.val().length;
						if(length <= 0){
							if (window.confirm(msg)) {
								scope.$apply(attrs.deleteTag);
							}
						}						
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
						scope.$apply(attrs.newTag);
					}
				});
			}
		};
	}
]);