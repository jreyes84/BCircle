'use strict';

// Configsystems controller
angular.module('configsystems').controller('ConfigsystemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Configsystems', 'TemplateMovimientos',
	function($scope, $stateParams, $location, Authentication, Configsystems , TemplateMovimientos) {
		$scope.authentication = Authentication;

		// Create new Configsystem
		$scope.create = function() {
			// Create new Configsystem object
			var configsystem = new Configsystems ({
				name: this.name
			});

			// Redirect after save
			configsystem.$save(function(response) {
				$location.path('configsystems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Configsystem
		$scope.remove = function( configsystem ) {
			if ( configsystem ) { configsystem.$remove();

				for (var i in $scope.configsystems ) {
					if ($scope.configsystems [i] === configsystem ) {
						$scope.configsystems.splice(i, 1);
					}
				}
			} else {
				$scope.configsystem.$remove(function() {
					$location.path('configsystems');
				});
			}
		};

		// Update existing Configsystem
		$scope.update = function() {
			var configsystem = $scope.configsystem ;

			configsystem.$update(function() {
				$location.path('configsystems/' + configsystem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Configsystems
		$scope.find = function() {
			$scope.configsystems = Configsystems.query();
		};

		// Find existing Configsystem
		$scope.findOne = function() {
			$scope.configsystem = Configsystems.get({ 
				configsystemId: $stateParams.configsystemId
			});
		};
	}
]);