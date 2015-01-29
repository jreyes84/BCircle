'use strict';

angular.module('documentos').directive('select2', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.select2({width: '100%'}).change(function(params){
					if(params.added!== undefined || params.removed !== undefined){
						if(scope.onCuentasChange !== undefined)	
							scope.onCuentasChange(params.added , params.removed );
					}
				});
			}
		};
	}
]);