'use strict';

// Polizas controller
angular.module('polizas').controller('PolizasController', ['$scope' , '$http' , '$stateParams', '$location', 'Authentication', 'Polizas','Contactos', 'Cuentas',
	function($scope , $http, $stateParams, $location, Authentication, Polizas , Contactos , Cuentas ) {
		$scope.authentication = Authentication;
		// Create new Poliza
		$scope.create = function() {
			// Create new Poliza object
			var poliza = new Polizas ({
				name: this.name
			});

			// Redirect after save
			poliza.$save(function(response) {
				//$location.path('polizas/' + response._id);
				// Clear form fields
				//$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Poliza
		$scope.update = function() {
			var poliza = $scope.poliza ;
			poliza.$update(function() {
				$location.path('polizas/' + poliza._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Polizas
		$scope.find = function() {
			Contactos.query(function(response){
				//Fill contactos.
				$scope.inputTagContactos = [];
				angular.forEach(response, function( val , key ){
					$scope.inputTagContactos.push( { id : val._id , text : val.firstName + ' ' + val.lastName + ' - ' + val.comercialName } );
				});

				$scope.inputTagCuentas = [];
				$http.post('/template-movimientos/listTemplatesAndCuentas').success(function(response){
					$scope.inputTagCuentas = response;
				}).error(function(response){
					console.log(response);
				});
			});
		};

		$scope.addItemToTable = function(){
			if($scope.documentos.items === undefined)
				$scope.documentos.items = [];

			$scope.documentos.items.push({
				cantidad : 0,
				descripcion : '',
				precio : 0,
				subtotal : 0,
				impuesto : 16,
				total_impuesto : 0,
				total : 0,
				edit : true
			});
		};
		$scope.editField = function( item, value, event){
			if(event!==undefined){
				if(event.charCode === 13){
					item.edit = value;	
					$scope.addItemToTable();	
				}
			}else
			{
				item.edit = value;
			}
		};

		$scope.lostFocusField = function( item , value){
			//item.edit = value;		
		};
	}
]);