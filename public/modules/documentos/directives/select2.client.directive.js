'use strict';

angular.module('documentos').directive('select2', ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.select2({width: '100%'}).change(function(params){
					if(params.added!== undefined || params.removed !== undefined){
						if(scope.onCuentasChange !== undefined)	
							scope.onCuentasChange(params.added , params.removed );
					}
				}).on('select2-opening', function() {
					if(scope.onChangeSelectProducts)
						$timeout(function(){
							element.parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().find('.select2-results .select2-result').removeClass('select2-selected');
						});
		        }).on('select2-open', function(){
		        	if(scope.onChangeSelectProducts)
			        	$timeout(function(){
							element.parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().find('.select2-results .select2-result').removeClass('select2-selected');
						});
		        }).on('select2-selecting', function(e) {
		        	if(scope.onChangeSelectProducts)
		        		scope.onChangeSelectProducts(e.object);
		        });
			}
		};
	}
]);