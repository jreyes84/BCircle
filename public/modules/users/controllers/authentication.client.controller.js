'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$stateParams','Authentication', '$element',
	function($scope, $http , $stateParams, Authentication, $element) {
		$scope.authentication = Authentication;
		$scope.msgError='';
		$scope.forgot = false;
		$scope.register = false;
		$scope.login = true;
		$scope.credentials={};

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
				console.log($scope.error);
			});
		};

		$scope.forgoted = function(){
			console.log('Home');
			$http.post('/auth/forgot',$scope.credentials).success(function(response){

			}).error(function(response){
				$scope.error = response.message;

			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				$scope.error = undefined;
				window.location.reload();
				// And redirect to the index page
			}).error(function(response) {
				$scope.error = response.message;
				if($scope.error === 'Unknown user'){
					$scope.msgError = 'Usuario no encontrado';
				}
			});
		};

		$scope.onClickNew= function(){
			$scope.forgot = false;
			$scope.register = true;
			$scope.login = false;
		};

		$scope.onClickForgot= function(){
			$scope.register = false;
			$scope.forgot = true;
			$scope.login = false;
		};

		$scope.onClickLogin = function(){
			$scope.register = false;
			$scope.forgot = !false;
			$scope.login = true;
		};
	}
]);
