'use strict';

// Menus controller
angular.module('menus').controller('MenusController', ['$scope', '$http' , '$stateParams', '$location', '$timeout' , 'Socket', 'Authentication', 'Menus',
	function($scope , $http, $stateParams, $location, $timeout , Socket, Authentication, Menus) {
		$scope.authentication = Authentication;

		// Create new Menu
		$scope.create = function() {
			// Create new Menu object
			var menu = new Menus ( $scope.newmenu );
			menu.$save(function(response){
				$scope.menus.push(response);
				$scope.newmenu = null;
				$scope.msgSmartNotification('Menú','Su menú fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};

		// Remove existing Menu
		$scope.remove = function( menu ) {
			if ( menu ) { menu.$remove();

				for (var i in $scope.menus ) {
					if ($scope.menus [i] === menu ) {
						$scope.menus.splice(i, 1);
					}
				}
			} else {
				$scope.menu.$remove(function() {
					$location.path('menus');
				});
			}
		};

		$scope.edit = function(menu){
			$scope.newmenu = null;
			$scope.newmenu = menu;
		};
		$scope.clean = function(){
			$scope.newmenu = null;
		};

		// Update existing Menu
		$scope.update = function() {
			var menu = $scope.newmenu;
			menu.$update(function(response) {
				$scope.msgSmartNotification('Menú','Su menú fue actualizado correctamente','fa fa-check','#739E73');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		// Find a list of Menus
		$scope.find = function() {
			$scope.menus = Menus.query();
		};

		// Find existing Menu
		$scope.findOne = function() {
			/*$scope.menu = Menus.get({ 
				menuId: $stateParams.menuId
			});*/
		};

		$scope.newSubmenu = function(){
			var isNew = false;
			$scope.error ='';
			
			var children = {
				name : '',
				description : '',
				url : '',
				icono : '',
				order : 0,
				status : true				
			};

			if($scope.newmenu){
				if(!$scope.newmenu.children)
				{
					$scope.newmenu.children=[];
					$scope.newmenu.children.push( children);
					isNew = true;
				}
				var last = $scope.newmenu.children.length-1;
				if(!isNew){
					if($scope.newmenu.children[last] === '')
					{
						$scope.error = '';
					}else{
						$scope.error = '';
						$scope.newmenu.children.push(children);
					}
				}
			}else
			{
				$scope.error ='Es necesario llenar los campos anteriores';
				//isNew = true;
			}
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