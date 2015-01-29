'use strict';

// Movimientos controller
angular.module('movimientos').controller('MovimientosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Movimientos',
	function($scope, $stateParams, $location, Authentication, Movimientos ) {
		$scope.authentication = Authentication;

		// Create new Movimiento
		$scope.create = function() {
			// Create new Movimiento object
			var movimiento = new Movimientos ({
				name: this.name
			});

			// Redirect after save
			movimiento.$save(function(response) {
				$location.path('movimientos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Movimiento
		$scope.remove = function( movimiento ) {
			if ( movimiento ) { movimiento.$remove();

				for (var i in $scope.movimientos ) {
					if ($scope.movimientos [i] === movimiento ) {
						$scope.movimientos.splice(i, 1);
					}
				}
			} else {
				$scope.movimiento.$remove(function() {
					$location.path('movimientos');
				});
			}
		};

		// Update existing Movimiento
		$scope.update = function() {
			var movimiento = $scope.movimiento ;

			movimiento.$update(function() {
				$location.path('movimientos/' + movimiento._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Movimientos
		$scope.find = function() {
			$scope.movimientos = Movimientos.query();
		};

		// Find existing Movimiento
		$scope.findOne = function() {
			$scope.movimiento = Movimientos.get({ 
				movimientoId: $stateParams.movimientoId
			});
		};
	}
]);