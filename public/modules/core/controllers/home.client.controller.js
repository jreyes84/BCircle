'use strict';


angular.module('core').controller('HomeController', ['$scope', '$rootScope' , '$http', '$element' , 'Authentication', '$location','Contactos', 'Users','Keyboardmanager',
	function($scope, $rootScope , $http , $element, Authentication , $location, Contactos, Users, Keyboardmanager) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		
		$scope.getContacts = function(){
			$scope.contactos = Contactos.query();
		};

		$scope.getUsers = function(){
			$http.get('/users/userslist' , $scope.user).success(function(response) {
				$scope.users = response;
			}).error(function(response){
				$scope.error = response.message;
			}); 
		};

		Keyboardmanager.bind('ctrl+shift+n', function() {
			$element.find('input[name="top-note"]').focus();
		});

		
		Keyboardmanager.bind('ctrl+shift+d', function() {
			$location.url('documentos');
		});		

	}
]);