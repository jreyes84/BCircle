'use strict';

// Cod postals controller
angular.module('cod-postals').controller('CodPostalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CodPostals' , '$element',
	function($scope, $stateParams, $location, Authentication, CodPostals , $element ) {
		$scope.authentication = Authentication;

		// Create new Cod postal
		$scope.create = function() {
			// Create new Cod postal object
			var codPostal = new CodPostals ({
				//d_codigo: this.d_codigo
			});

			// Redirect after save
			codPostal.$save(function(response) {
				$location.path('cod-postals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cod postal
		$scope.remove = function( codPostal ) {
			if ( codPostal ) { codPostal.$remove();

				for (var i in $scope.codPostals ) {
					if ($scope.codPostals [i] === codPostal ) {
						$scope.codPostals.splice(i, 1);
					}
				}
			} else {
				$scope.codPostal.$remove(function() {
					$location.path('cod-postals');
				});
			}
		};

		// Update existing Cod postal
		$scope.update = function() {
			var codPostal = $scope.codPostal ;

			codPostal.$update(function() {
				$location.path('cod-postals/' + codPostal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cod postals
		$scope.find = function() {
			$scope.codPostals = CodPostals.query();
		};

		// Find existing Cod postal
		$scope.findOne = function() {
			$scope.codPostal = CodPostals.get({ 
				codPostalId: $stateParams.codPostalId
			});
		};

		$scope.clickTable = function(){
			var array = $element.find('#myPostalCodeTable tbody').html().split('<tr>');

			angular.forEach(array,function(v, k){
				if(array[k] === ''){
					//console.log('vacio');
					//delete array[k];
					array.splice(k, 1);
				}
				array[k] = array[k].replace('</tr>','');
				//console.log(array[k]);
			});
			//console.log(array);
			var td=[];
			angular.forEach(array, function(v,k){
				td = array[k].split('<td>');
				angular.forEach(td,function(val,ke){
					if(td[ke] ===''){
						td.splice(ke,1);
					}
					td[ke] = td[ke].replace('</td>','');

				});
				//console.log(td);
				var codPostal = new CodPostals ({
					d_codigo :			td[0],
					d_asenta :			td[1],
					d_tipo_asenta : 	td[2],
					D_mnpio	: 			td[3],
					d_estado:			td[4],
					d_ciudad:			td[5],
					d_CP	: 			td[6],
					c_estado:			td[7],
					c_oficina :			td[8],
					c_CP	: 			td[9],
					c_tipo_asenta	: 	td[10],
					c_mnpio	: 			td[11],
					id_asenta_cpcons : 	td[12],
					d_zona	: 			td[13],
					c_cve_ciudad : 		td[14]
				});
				//console.log(codPostal);
				// Redirect after save
				codPostal.$save(function(response) {
						console.log('Success');
				}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
				});
			});
			/*var tr = $element.find('#myPostalCodeTable');			
			angular.forEach(tr.find('tr'), function(value,key){
				//console.log(key);
				angular.forEach(value,function(val, ke){
					//console.log(val);
				});
			});*/
		};
	}
]);