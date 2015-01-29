'use strict';

angular.module('core').controller('HeaderController', ['$scope' , '$rootScope' , '$location' , '$element', '$http', '$timeout' , 'Authentication', 'Users' , 'Menus', 'Documentos', 'Socket',
	function($scope, $rootScope, $location ,$element , $http, $timeout , Authentication, Users , Menus, Documentos, Socket ) {
		$scope.user = Authentication.user;
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.total = 0;

		Socket.on('notify.totalNotifying', function(array){
			if(array.total === -1){
				$scope.total+=array.total;
			}else{
				$scope.total = array.total;	
			}			
		});

		var activeMenu = $scope.user.theme.replace('css/themes/','');
		
		angular.forEach($element.find('#colors-thems li'),function(li,key){
			var id = '#'+$element.find(li).attr('id');
			$element.find(id).removeClass('active');
		});
		if(activeMenu!=='')
			$element.find('#'+activeMenu).addClass('active');
		else
			$element.find('#default').addClass('active');
		
		var menus = new Menus();

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.getMenus = function(){
			$http.get('/menus/myMenulist' , $scope.user).success(function(response) {
				$scope.success = true;
				$scope.menus = response;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		$scope.changeLocation = function(url){
			if(url !== '')
				$location.path(url);
		};

		$scope.childClickLocation = function(url){
			if(url !== '')
				$location.path(url);
		};

		$scope.logout = function(){
			$scope.logout=false;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.onColorClick = function(element){
			if(element === 'default'){
				Authentication.user.theme = '';	
			}else{
				Authentication.user.theme = $element.find('#'+element + ' a').attr('data-theme').replace('.css','');
			}
			
			var user = new Users(Authentication.user);
			angular.forEach($element.find('#colors-thems li'),function(li,key){
				var id = '#'+$element.find(li).attr('id');
				$element.find(id).removeClass('active');
			});
			
			$element.find('#'+element).addClass('active');
			
			user.$update(function(response){
				Authentication.user = response;
				$scope.user = Authentication.user;
				$scope.authentication = Authentication;

			});

		};

		$scope.deleteClassActiveColor = function(elementActive){
			angular.forEach($element.find('#colors-thems li'),function(li,key){
				console.log(li);
			});
		};
	}
]);