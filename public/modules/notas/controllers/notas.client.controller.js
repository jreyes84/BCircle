'use strict';

// Notas controller
angular.module('notas').controller('NotasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notas',
	function($scope, $stateParams, $location, Authentication, Notas ) {
		$scope.authentication = Authentication;

		// Create new Nota
		$scope.create = function() {
			// Create new Nota object
			var nota = new Notas ({
				name: this.name
			});

			// Redirect after save
			nota.$save(function(response) {
				$location.path('notas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Nota
		$scope.remove = function( nota ) {
			if ( nota ) { nota.$remove();

				for (var i in $scope.notas ) {
					if ($scope.notas [i] === nota ) {
						$scope.notas.splice(i, 1);
					}
				}
			} else {
				$scope.nota.$remove(function() {
					$location.path('notas');
				});
			}
		};

		// Update existing Nota
		$scope.update = function() {
			var nota = $scope.nota ;

			nota.$update(function() {
				$location.path('notas/' + nota._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notas
		$scope.find = function() {
			$scope.notas = Notas.query();
		};

		// Find existing Nota
		$scope.findOne = function() {
			$scope.nota = Notas.get({ 
				notaId: $stateParams.notaId
			});
		};
	}
]);