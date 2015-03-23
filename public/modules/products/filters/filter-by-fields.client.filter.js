'use strict';

angular.module('products').filter('filterByFields', [
	function() {
		return function (items, letter, field) {
			if(items){
				var filtered = [];

		        var letterMatch = new RegExp(letter, 'i');
		        var split = field.split('.');


	        	for (var i = 0; i < items.length; i++) {
		            var item = items[i];
		            if(letter.length>1){

		            	if(split.length>1){
		            		if (letterMatch.test(item[split[0]][split[1]])) {
				                filtered.push(item);
				            }
		            	}else{
		            		if (letterMatch.test(item[field])) {
				                filtered.push(item);
				            }	
		            	}
		            }else if(letter.length===1){
		            	if(split.length>1){
		            		if (letterMatch.test(item[split[0]][split[1]].substring(0, 1))) {
				                filtered.push(item);
				            }
		            	}else{
		            		if (letterMatch.test(item[field].substring(0, 1))) {
				                filtered.push(item);
				            }
		            	}
		            }else if(letter===''){
		            	filtered.push(item);
		            }
	        	}
		        return filtered;	
			}
		};
	}
]);