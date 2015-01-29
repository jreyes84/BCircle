'use strict';

angular.module('historials').filter('sumByKey', [
	function() {
		return function(data, key, type) {
            if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
                return 0;
            }
 
            var sum = 0;
            for (var i = data.length - 1; i >= 0; i--) {
            	if(type === data[i].typeaccount)
                	sum += parseInt(data[i][key]);
            }
 
            return sum;
        };
	}
]);