'use strict';

angular.module('historials').filter('sumByKey', [
	function() {
		return function(data, key, type,circleFilter) {
            if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
                return 0;
            }
            var sum = 0;
            angular.forEach(data, function(myData, i){
                if(myData.typeaccount === type){
                    angular.forEach(myData.circles, function(circles, c){
                        if (circles.name === circleFilter){
                            sum+= parseInt(myData[key]);
                        }
                    });
                }
            });

            return sum;
        };
	}
]);