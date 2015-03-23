'use strict';

// Promocions controller
angular.module('promocions').controller('PromocionsController', ['$scope', '$http' , '$stateParams', '$location' , '$element' , '$timeout', 'Authentication', 'Products', 'Promocions' ,
	function($scope , $http , $stateParams, $location, $element ,  $timeout , Authentication, Products, Promocions  ) {
		$scope.authentication = Authentication;
		$scope.blockNew = false;
		$scope.blockEdit = false;
		$scope.field = 'name';
		$scope.findMeByText = 'Nombre';
		$scope.letter='';

		// Create new Promocion
		$scope.create = function() {
			// Create new Product object
			var promocion = new Promocions ($scope.promocion);

			var array=[];
			var backUp=[];
			angular.copy($scope.promocion.combo,backUp);
			angular.forEach($scope.promocion.combo, function(res){
				var id = res.id;
				array.push( { id : id } );
			});

			$scope.promocion.combo = [];
			$scope.promocion.combo = array;

			if(promocion._id){
				$scope.update(promocion);
				$scope.promocion.combo = backUp;
			}else{
				// Redirect after save
				promocion.$save(function(response) {
					$scope.msgSmartNotification('Promociones','Promoción agregado correctamente','fa fa-check','#739E73');
					$scope.find();
					console.log(backUp);
					$timeout(function(){
						$scope.promocion.combo = backUp;
					});
					
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
					$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
				});
			}
		};

		// Update existing Promocion
		$scope.update = function(promocion) {			
			promocion.$update(function(response) {
				$scope.msgSmartNotification('Promociones','Promoción actualizado correctamente','fa fa-check','#739E73');
				$scope.find();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		// Find a list of Promocions
		$scope.find = function() {
			Promocions.query(function( promotions){
				$scope.promocions = promotions;
				
				angular.forEach(promotions, function(promotion){
					var array = [];
					angular.forEach(promotion.combo, function(combo){
						array.push({id : combo.id._id, name : combo.id.name});
					});
					promotion.combo = [];
					promotion.combo = array;
				});
			});

			Products.query(function(products){
				$scope.products = products;
				$scope.inputTagProductos = [];
				angular.forEach(products,function(product){
					$scope.inputTagProductos.push({id : product._id, name : product.name});
				});
			});
		};

		//SmartNotifications
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

		   //Clean array
	    $scope.cleanCredentials = function(){
	    	$scope.promocion = { active : true };
			$scope.blockEdit = false;
			$scope.blockNew = true;		
		};

		//Close content fields
		$scope.onClickCancel = function(){
			$scope.promocion = null;
			$scope.blockEdit = false;
			$scope.blockNew = false;
		};
		//Filter Name
		$scope.searchName = function(letter){
			$scope.letter = letter;
		};

		$scope.changeOption = function(option,text){
			$scope.findMeBy = option;
			$scope.findMeByText = text;
		};

		//filter change
		$scope.changeOption = function(option,text){
			$scope.field = option;
			$scope.findMeByText = text;
		};
		//select changed
		$scope.onChangeSelectProducts = function(product){
			$timeout(function(){
				$scope.productSelected = [];	
			});
			if(!$scope.promocion)
				$scope.promocion = {};

			if(!$scope.promocion.combo)
				$scope.promocion.combo = [];

			$scope.promocion.combo.push({id : product.id, name:product.text});
		};
		//Delete product from combo
		$scope.onDeleteProduct = function(index){
			$scope.promocion.combo.splice(index,1);
		};

		//Change value slider
		$scope.onChangeSlider = function(value){
		};

		//Edit
		$scope.edit = function(promocion){
			$scope.promocion = promocion;
			$scope.blockEdit = true;
			$scope.blockNew = false;
			$element.find('#content-list').removeClass('col-lg-12').addClass('col-lg-8').next().show('folder');	
		};
	}
]);