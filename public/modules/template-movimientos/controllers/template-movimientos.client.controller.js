'use strict';

// Template movimientos controller
angular.module('template-movimientos').controller('TemplateMovimientosController', ['$scope', '$element','$http', '$stateParams', '$location' , '$timeout' , 'Authentication', 'TemplateMovimientos', 'Cuentas', 'Circulos',
	function($scope, $element, $http, $stateParams, $location, $timeout, Authentication, TemplateMovimientos, Cuentas, Circulos ) {
		$scope.authentication = Authentication;
		$scope.templates = [];
		$scope.templateOptions = [];
		$scope.inputTagTipoMovimiento = [];
		$scope.inputTagCuentas = {};
		$scope.indexTipoMovimiento = 0;
		$scope.nameTemplate ='';
		$scope.enableInputTipoMovimiento = false;
		$scope.enableInputMovimiento = false;
		$scope.enableInputDescripcion = false;
		$scope.newCircle = false;

		$scope.news = [];
		// Create new Template movimiento
		$scope.create = function(name,callback) {
			// Create new Template movimiento object
			var templateMovimiento = new TemplateMovimientos ({
				name: name
			});

			// Redirect after save
			templateMovimiento.$save(function(response) {
				$scope.templateMovimientos.push(response);
				$scope.indexTipoMovimiento = $scope.templateMovimientos.length-1;
				if(callback!== undefined){
					callback();
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Template movimiento
		$scope.remove = function( templateMovimiento ) {
			if ( templateMovimiento ) { templateMovimiento.$remove();
				for (var i in $scope.templateMovimientos ) {
					if ($scope.templateMovimientos [i] === templateMovimiento ) {
						$scope.templateMovimientos.splice(i, 1);
					}
				}
			} else {
				$scope.templateMovimiento.$remove(function() {
					$location.path('template-movimientos');
				});
			}
		};

		// Update existing Template movimiento
		$scope.update = function( array, callback) {
			var templateMovimiento = array;
			templateMovimiento.$update(function(response) {
				if(callback !== undefined){
					callback();
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Template movimientos
		$scope.find = function(callback) {
			$scope.myTemplate = undefined;
			$scope.templates = [];
			$scope.templateOptions = [];
			$scope.findCuentas(function(){
				TemplateMovimientos.query(function(response){
					$scope.templateMovimientos = response;
					$element.find('#tipoMovimiento').trigger('chosen:updated');	
					angular.forEach(response, function(value, key){
						$scope.templates.push({ name : value.name });
						$scope.templateOptions.push({ name : value.name });
						$scope.myTemplate = $scope.templateMovimientos[0].name;
						//angular.forEach(value.cuenta, function(c,ck){
							//if(!$scope.news[key])
						//		$scope.news[key]= [];
						//	$scope.news[key][ck] = c.idcuenta;			
						//});
					});
					$scope.circulos = Circulos.query();
					$scope.cuentas = Cuentas.query();
				});
			});
			
		};

		$scope.findCuentas = function(callback){
			$http.post('/cuentas/listdetalle').success(function(response) {
				angular.forEach(response, function(val,key){
					$scope.inputTagCuentas[val._id] = val.name;
				});
				callback();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//Choosen change
		$scope.onChangeChoosen = function(){
			var name ='';
			name = $element.find('#tipoMovimiento > option').val();
			
			$scope.create(name,function(){
				$scope.myTemplate = name;	
			});
		};
		$scope.changeSelected = function(){	
			var index = Number($element.find('#tipoMovimiento').val());
			if(isNaN(index)){
				index = $element.find('#tipoMovimiento > option').length-2;
			}
			$scope.indexTipoMovimiento = index;
			$scope.myTemplate = $scope.templateMovimientos[index].name;
		};

		//OnClickTipoMovimiento Menu
		$scope.onClickTipoMovimiento = function(tipo){
			$scope.tipoSelected = tipo.name;
			$scope.changeSelect(tipo);

		};
		//Enable input
		$scope.enableEdit = function(array,value){
			$scope.nameTemplate = array.name;
			$scope.enableInputsEdit(value);
		};

		$scope.onKeypress = function(e , array , value){
			if( e.keyCode === 13 || e.keyCode === 9 ){
				$scope.update(array, function(){
					$timeout($scope.find, 100);
				});
				$scope.enableInputsEdit( value);
			}
		};

		$scope.onBlur = function(array, value){
			$scope.update(array);
			$scope.enableInputsEdit(value);
		};


		$scope.enableInputsEdit = function(value){
			$scope.editName = value;
		};

		$scope.deleteItem = function(tipo){
			var name = '';
			if( tipo >= 0 ){
				name = $scope.templateMovimientos[tipo].name;
				angular.forEach($scope.templates, function(val, key){
					if( val.name === name ){
						$scope.templates.splice(key,1);
					}
				});
				var arrays = $scope.templateMovimientos[tipo];
				$scope.templateMovimientos.splice( tipo , 1 );
				arrays.eliminar = 1;
				$scope.indexTipoMovimiento = 0;
				if($scope.templateMovimientos.length>0){
					$scope.myTemplate = $scope.templateMovimientos[$scope.indexTipoMovimiento].name;
				}
				
				$scope.update(arrays, function(){
					$timeout($scope.find, 100);
				});
			}
		};

		$scope.onDeleteCuenta = function(cuenta, tipo , index){
			$scope.templateMovimientos[tipo].cuenta.splice(index,1);
			$scope.update($scope.templateMovimientos[tipo]);

		};

		$scope.onChangeThisSelect = function(deselected, selected, tipo){
			tipo = $scope.indexTipoMovimiento !== tipo ? $scope.indexTipoMovimiento : tipo;
			var _id;
			var name;
			if(deselected !== undefined){
				_id = deselected;
				name = $scope.inputTagCuentas[_id];
				angular.forEach($scope.templateMovimientos[tipo].cuenta,function(val,key){
					if(val.idcuenta === deselected){
						$scope.templateMovimientos[tipo].cuenta.splice(key,1);
					}
				});
			}else{
				_id = selected;
				name = $scope.inputTagCuentas[_id];
				var typeaccount ='';
				angular.forEach($scope.cuentas, function(tipos){
					typeaccount = tipos.typecuenta;
					if(tipo._id+'' === _id+''){
						$scope.templateMovimientos[tipo].cuenta.push({idcuenta: tipos._id, name : tipos.name, typeaccount: typeaccount});
					}else{
						angular.forEach(tipos.cuenta, function(cuenta){
							if(cuenta._id+'' === _id+''){
								$scope.templateMovimientos[tipo].cuenta.push({idcuenta: cuenta._id, name : cuenta.name, typeaccount: typeaccount});
							}else{
								angular.forEach(cuenta.subcuenta, function(subcuenta){
									if(subcuenta._id+'' === _id+''){
										$scope.templateMovimientos[tipo].cuenta.push({idcuenta: subcuenta._id, name : subcuenta.name, typeaccount: typeaccount});
									}else{
										angular.forEach(subcuenta.detalle,function(detalle){
											if(detalle._id+'' === _id+''){
												$scope.templateMovimientos[tipo].cuenta.push({idcuenta: detalle._id, name : detalle.name, typeaccount: typeaccount});
											}
										});
									}
								});
							}
						});
					}
				});
			}
			
			$timeout(function(){
				$scope.news[tipo] = [];	
				$scope.update($scope.templateMovimientos[tipo]);
			});
		};

		$scope.onchangeSelect = function(tipo){
			$scope.update($scope.templateMovimientos[tipo]);	
		};

		$scope.cargoChange = function(index){
			$scope.update($scope.templateMovimientos[index]);
		};

		$scope.onChangeText = function(array){
			$scope.myTemplate = array.name;
		};

		//CIRCLES OPTIONS
		$scope.onClickLi = function(index, newCircle, circulo){
			$timeout(function(){
				$element.find('#c-options_'+index).addClass('open');	
			});

			if(newCircle === 0){
				$scope.newCircle = false;
				if($scope.templateMovimientos[index].circles[circulo].checked){
					$scope.templateMovimientos[index].circles[circulo].checked = false;
				}
				else{
					$scope.templateMovimientos[index].circles[circulo].checked = true;
				}
				$scope.update($scope.templateMovimientos[index]);					
			}else if(newCircle === 1){
				$scope.newCircle = true;
				$timeout(function(){
					$element.find('#newCircleInput_'+index).focus();
				});
			}
		};

		$scope.onKeyPressNewCircle = function(e , index){
			if(e.keyCode === 27){
				$scope.newCircle = false;
				$scope.templateMovimientos[index].circleName = '';
			}else if(e.keyCode === 13){
				if($scope.templateMovimientos[index].circleName !== '' || $scope.templateMovimientos[index].circleName !==undefined)
					$scope.createCircle(index);
			}
		};

		$scope.clicked = function(index, circle){
			$scope.createCircle(index,circle);
		};

		// Create new Circulo
		$scope.createCircle = function(index,circle) {
			// Create new Menu object
			var circulo = new Circulos ( { name : $scope.templateMovimientos[index].circleName , user: $scope.authentication.user._id } );
			circulo.$save(function(response){
				$scope.circulos.push(response);
				$scope.circulo = null;
				$scope.templateMovimientos[index].circleName = '';
				$scope.templateMovimientos[index].circles.push({name : response.name, idcircle: response._id, checked: true });
				$scope.update($scope.templateMovimientos[index]);
				$scope.newCircle = false;
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};
		//END CIRCLE OPTIONS

		//Notifications
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