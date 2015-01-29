'use strict';

angular.module('contactos').filter('contactsFilters', [
	function() {
		return function (items, letter) {
			if(items){
				var filtered = [];
		        var letterMatch = new RegExp(letter, 'i');
		        	for (var i = 0; i < items.length; i++) {
			            var item = items[i];
			            if (letterMatch.test(item.razonSocial.substring(0, 1))) {
			                filtered.push(item);
			            }
		        	}			        
		        return filtered;	
			}
			
		};
	}
]);