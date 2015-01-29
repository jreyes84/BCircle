'use strict';

angular.module('users').directive('chosen', [
	function() {
		return {
			restrict: 'A',
			require : 'ngModel',
			link: function Linker(scope, element, attrs, ngModel) {
				var model = attrs.ngModel;
				var onChangeSelect = attrs.onChangeSelect;
				var onFindWord = attrs.onFindWord;
				var NoAdd = attrs.noAdd;

				if(NoAdd === undefined && onChangeSelect === undefined){
					element.chosen({width: '100%', no_results_text: 'No encontrado, para agregarlo presione ENTER'});
					var chosen = element.data('chosen');
					chosen.dropdown.find('input').on('keyup' , function(e){
						if (e.which === 13 && chosen.dropdown.find('li.no-results').length > 0)
				        {	
				        	var o = new Option(this.value, this.value);
				            // add the new option
				            element.prepend(o);
				            // automatically select it
				            element.find(o).prop('selected', true);
				            // trigger the update
				            element.trigger('chosen:updated');
				            scope.$apply(attrs.changeChoose);
				        }
					});
				}else if(onChangeSelect!==undefined){
					element.chosen({width: '100%'}).change(function(evt,params){
						scope.$parent.onChangeThisSelect(params.deselected, params.selected , scope.$index);
					});
				}else if(onFindWord !== undefined){
					element.chosen({width: '100%' , no_results_text : 'No hay resultados' });
					var data = element.data('chosen');
					data.container.find('input').on('keyup', function(e){
						if(this.value.length>2){	
				            scope.findContacto(this.value);
						}
					});
				}else{
					element.chosen( { width : '100%' } );					
				}

				if(model !== null){
					scope.$watch(model , function(){
						element.trigger('chosen:updated');
					});
				}
			}
		};
	}
]);