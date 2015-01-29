'use strict';

angular.module('users').directive('userUpdateBlock', [
	function() {
		return {
			restrict: 'A',
			link: function Linker(scope, element, attrs, transclude) {
				var block = element.parent().parent().parent().parent().parent().parent().parent().parent().find('#block-update-contact');
				var list = element.parent().parent().parent().parent().parent().parent().parent().parent().find('#contacts-list');
				var add = element.parent().parent().parent().parent().parent().parent().parent().parent().find('#block-add-contact');
				element.on('click',function(){
					block.fadeIn();
					if(add.css('display')==='block')
			        {
			        	add.fadeOut();	
			        }
					list.removeClass('col-lg-12');
        			list.addClass('col-lg-8');
				});
				
			}
		};
	}
]);