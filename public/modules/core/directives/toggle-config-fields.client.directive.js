'use strict';

angular.module('core').directive('toggleConfigFields', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				var idContent = attrs.idContent;

				if(idContent === 'add-content'){
					element.css('display', 'none');
				}

				element.bind('click', function(e) {
					if(attrs.typeAnimation!== undefined){
						if(attrs.typeAnimation==='add' || attrs.typeAnimation === 'update'){
							element.parent().parent().parent().parent().parent().find('#content-list').removeClass('col-lg-12');
							element.parent().parent().parent().parent().parent().find('#content-list').addClass('col-lg-8').next().show('folder');
						}
						
						if(attrs.typeAnimation === 'cancel'){
							element.parent().parent().parent().parent().fadeOut('slow',function(){
								element.parent().parent().parent().parent().css('display','none');
								element.parent().parent().parent().parent().parent().find('#content-list').removeClass('col-lg-8');
								element.parent().parent().parent().parent().parent().find('#content-list').addClass('col-lg-12');	
							});
						}
					}
				});
			}
		};
	}
]);