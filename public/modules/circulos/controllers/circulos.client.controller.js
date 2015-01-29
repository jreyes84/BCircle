'use strict';

// Circulos controller
angular.module('circulos').controller('CirculosController', ['$scope', '$stateParams', '$location', '$timeout', 'Authentication', 'Circulos',
	function($scope, $stateParams, $location, $timeout , Authentication, Circulos  ) {
		$scope.authentication = Authentication;

		// Create new Circulo
		$scope.create = function() {
			// Create new Menu object
			$scope.user = $scope.authentication.user._id;
			var circulo = new Circulos ( $scope.circulo );
			circulo.$save(function(response){
				$scope.circulos.push(response);
				$scope.circulo = null;
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};


		// Remove existing Circulo
		$scope.remove = function( circulo ) {
			if ( circulo ) { circulo.$remove();

				for (var i in $scope.circulos ) {
					if ($scope.circulos [i] === circulo ) {
						$scope.circulos.splice(i, 1);
					}
				}
			} else {
				$scope.circulo.$remove(function() {
					$location.path('circulos');
				});
			}
		};

		$scope.edit = function(circulo){
			$scope.circulo = null;
			$scope.circulo = circulo;
		};

		$scope.clean = function(){
			$scope.circulo = null;
		};

		// Update existing Menu
		$scope.update = function() {
			var circulo = $scope.circulo;
			circulo.$update(function(response) {
				$scope.msgSmartNotification('Círculo','Su círculo fue actualizado correctamente','fa fa-check','#739E73');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		// Find a list of Circulos
		$scope.find = function() {
			$scope.circulos = Circulos.query();
		};

		// Find existing Circulo
		$scope.findOne = function() {
			$scope.circulo = Circulos.get({ 
				circuloId: $stateParams.circuloId
			});
		};

		$scope.searchName = function(letter){
			$scope.letter = letter;
		};

		$scope.msgSmartNotification = function( title,  content, icon, color){
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;

			$scope.isOk = true;	
			$timeout(function () {
            	$scope.isOk = undefined;
        	},1000);
		};
	}
]);