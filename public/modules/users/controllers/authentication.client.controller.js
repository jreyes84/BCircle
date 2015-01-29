'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', 'Authentication', '$element',
	function($scope, $http , Authentication, $element) {
		$scope.authentication = Authentication;
		// If user is signed in then redirect back home
		$scope.signup = function() {
			if(!$scope.credentials.roles){
				$scope.credentials.roles=[];
				$scope.credentials.roles.push('admin');
			}

			if( $scope.credentials.roles[0] === 'user' )
			{
				$scope.credentials.admin.push($scope.authentication.user.username);
			}

			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				if($scope.credentials.roles[0] === 'admin'){
					$scope.authentication.user = response;
					// And redirect to the index page
					window.location.reload();
				}else{
					console.log(response);
				}
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				window.location.reload();
				// And redirect to the index page
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
