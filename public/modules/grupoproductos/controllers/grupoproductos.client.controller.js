'use strict';

// Grupoproductos controller
angular.module('grupoproductos').controller('GrupoproductosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grupoproductos',
	function($scope, $stateParams, $location, Authentication, Grupoproductos ) {
		$scope.authentication = Authentication;

		// Create new Grupoproducto
		$scope.create = function() {
			// Create new Grupoproducto object
			var grupoproducto = new Grupoproductos ({
				name: this.name
			});

			// Redirect after save
			grupoproducto.$save(function(response) {
				$location.path('grupoproductos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grupoproducto
		$scope.remove = function( grupoproducto ) {
			if ( grupoproducto ) { grupoproducto.$remove();

				for (var i in $scope.grupoproductos ) {
					if ($scope.grupoproductos [i] === grupoproducto ) {
						$scope.grupoproductos.splice(i, 1);
					}
				}
			} else {
				$scope.grupoproducto.$remove(function() {
					$location.path('grupoproductos');
				});
			}
		};

		// Update existing Grupoproducto
		$scope.update = function() {
			var grupoproducto = $scope.grupoproducto ;

			grupoproducto.$update(function() {
				$location.path('grupoproductos/' + grupoproducto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Grupoproductos
		$scope.find = function() {
			$scope.grupoproductos = Grupoproductos.query();
		};

		// Find existing Grupoproducto
		$scope.findOne = function() {
			$scope.grupoproducto = Grupoproductos.get({ 
				grupoproductoId: $stateParams.grupoproductoId
			});
		};
	}
]);