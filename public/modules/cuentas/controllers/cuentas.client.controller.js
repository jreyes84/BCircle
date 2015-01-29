'use strict';

// Cuentas controller
angular.module('cuentas').controller('CuentasController', ['$scope','$http','$timeout', '$stateParams', '$location', '$element', 'Authentication', 'Cuentas', 'Circulos',
	function($scope, $http, $timeout , $stateParams, $location, $element, Authentication, Cuentas, Circulos ) {
		$scope.authentication = Authentication;	
		$scope.cuentas = [];
		$scope.tipoCuentaSelected = '';
		$scope.tipoCuentaIndex = undefined;
		$scope.txtCuenta =[];
		$scope.ciculo = [];
		$scope.circulos = [];
		$scope.textIdInputFocus ='';
		$scope.wizardActive = false ;
		$scope.showActivo = true;
		$scope.showPasivos = false;


		$scope.ACBlockVisible = true;
		$scope.AFBlockVisible = false;
		$scope.ADBlockVisible = false;

		$scope.PCBlockVisible = true;
		$scope.PFBlockVisible = false;
		$scope.PDBlockVisible = false;
		$scope.optionTypeOfAccount = [
						{value:'Activo', text:'Activo'}, 
						{value:'Pasivo', text:'Pasivo'}, 
						{value:'Capital', text:'Capital'}, 
						{value:'Ingreso', text:'Ingreso'}, 
						{value:'Egreso', text:'Egreso'}
						];
		$scope.theStatus = 0;

		// Create new Cuenta
		$scope.create = function(value, callback ) {
			// Create new Cuenta object
			if (value === '') {
	            return false;
	        }	        

			var cuenta = new Cuentas ({
				name : value
			});
			// Redirect after save
			cuenta.$save(function(response) {
				$scope.cuentas.push(response);
				if(callback)
				{
					callback();
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Cuenta
		$scope.update = function(account, callback) {
			account.$update(function(response) {
				$timeout($scope.setInputFocus, 100);
				if(callback){
					callback();
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});

		};

		// Find a list of Cuentas
		$scope.find = function() {
			Cuentas.query(function(response){
				$scope.cuentas = response;
				$scope.updateTagTipoCuenta();
			});
		};

		$scope.activeWizard = function(){
			$scope.wizardActive = true;
		};

		$scope.cancelWizard = function(){
			$scope.inputTagActivoCirculante = [];
			$scope.inputTagActivoFijo = [];
			$scope.inputTagActivoDiferido = [];
			$scope.inputTagPasivoCirculante = [];
			$scope.inputTagPasivoFijo = [];
			$scope.inputTagPasivoDiferido = [];
			$scope.cuentasTemp=[];
			$scope.wizardActive = false;
			$scope.showActivo = false;
			$scope.showPasivos = false;
		};
		//Update tags
		$scope.updateTagTipoCuenta = function(){
			$scope.inputTagTipoCuenta = [];
			$scope.inputTagCuenta = [];
			$scope.inputTagSubCuenta = [];
			$scope.inputTagDetalle = [];

			//circle
			$scope.arrayCircleTipo = [];
			$scope.arrayCircleCuenta = [];
			$scope.arrayCircleSubCuenta = [];
			$scope.arrayCircleDetalle = [];

			Circulos.query(function(circulos){
				$scope.circulo = [];
				$scope.circulos  = circulos;
				var circuloA = [];
				angular.forEach(circulos,function(circulo){
					circuloA.push({ name : circulo.name, _id : circulo._id, checked : false, circleName:'' });
				});

				circuloA.total = 0;
				circuloA.title = '';

				angular.forEach($scope.cuentas, function(value, key){
					value.isVisible = false;
					value.quantityVisible = false;
					value.total = 0;
					//Valores para las cantidades
					var tipoCantidad = 0;
					var cuentaCantidad = 0;
					var subcuentaCantidad = 0;
					var detalleCantidad = 0;

					$scope.inputTagTipoCuenta.push({name:value.name});
					var circuloTipo = angular.copy(circuloA);

					$scope.arrayCircleTipo.push(circuloTipo);
					$scope.fillCircles(value, $scope.arrayCircleTipo[key]);

					if(!$scope.inputTagCuenta[key]){
						$scope.inputTagCuenta[key] = [];
						$scope.arrayCircleCuenta[key]=[];
					}

					if( value.cuenta.length > 0 ){
						cuentaCantidad = 0;
						angular.forEach(value.cuenta,function(valCuenta, keyCuenta){
							valCuenta.isVisible = false;
							valCuenta.quantityVisible = false;

							$scope.inputTagCuenta[key].push({ name : valCuenta.name });
							var circuloCuenta = angular.copy(circuloA);

							$scope.arrayCircleCuenta[key].push(circuloCuenta);
					
							if(!$scope.inputTagSubCuenta[key]){
								$scope.inputTagSubCuenta[key] = [];
								$scope.arrayCircleSubCuenta[key]=[];
							}
									
							if(!$scope.inputTagSubCuenta[key][keyCuenta]){
								$scope.inputTagSubCuenta[key][keyCuenta] = [];
								$scope.arrayCircleSubCuenta[key][keyCuenta] = [];
							}
							//response, tipo, cuenta, subcuenta, detalle, actual
							$scope.fillCircles(valCuenta , $scope.arrayCircleCuenta[key][keyCuenta]);
							
							if(valCuenta.subcuenta.length > 0 ){
								subcuentaCantidad = 0;
								angular.forEach(valCuenta.subcuenta,function(valSubCuenta,keySubCuenta){
									valSubCuenta.isVisible = false;
									valSubCuenta.quantityVisible = false;

									$scope.inputTagSubCuenta[key][keyCuenta].push({name:valSubCuenta.name});
									var circuloSubCuenta = angular.copy(circuloA);

									$scope.arrayCircleSubCuenta[key][keyCuenta].push(circuloSubCuenta);
									
									$scope.fillCircles(valSubCuenta , $scope.arrayCircleSubCuenta[key][keyCuenta][keySubCuenta]);
									
									if(!$scope.inputTagDetalle[key]){
											$scope.inputTagDetalle[key] = [];
											$scope.arrayCircleDetalle[key] = [];
									}
									if(!$scope.inputTagDetalle[key][keyCuenta])
									{
										$scope.inputTagDetalle[key][keyCuenta] = [];
										$scope.arrayCircleDetalle[key][keyCuenta] = [];
									}
									if(!$scope.inputTagDetalle[key][keyCuenta][keySubCuenta])
									{
										$scope.inputTagDetalle[key][keyCuenta][keySubCuenta] = [];
										$scope.arrayCircleDetalle[key][keyCuenta][keySubCuenta] = [];
									}
									
									if(valSubCuenta.detalle.length>0){
										detalleCantidad = 0;
										angular.forEach( valSubCuenta.detalle , function( valDetalle , keyDetalle ){
											valDetalle.isVisible = false;
											valDetalle.quantityVisible = false;
											detalleCantidad += valDetalle.cantidad;	
											$scope.inputTagDetalle[key][keyCuenta][keySubCuenta].push( { name : valDetalle.name } );
											var circuloDetalle = angular.copy(circuloA);
											$scope.arrayCircleDetalle[key][keyCuenta][keySubCuenta].push(circuloDetalle);
											$scope.fillCircles(valDetalle, $scope.arrayCircleDetalle[key][keyCuenta][keySubCuenta][keyDetalle] );
											value.total +=1;
										});	
										valSubCuenta.cantidad = detalleCantidad;
										subcuentaCantidad += detalleCantidad;
									}else{
										subcuentaCantidad += valSubCuenta.cantidad;
									}
								});							
								valCuenta.cantidad = subcuentaCantidad;
								cuentaCantidad += subcuentaCantidad;
							}else{
								cuentaCantidad += valCuenta.cantidad;
							}
						});
						value.cantidad = cuentaCantidad;
					}
				});
			});
		};

		$scope.onClickCuenta = function(cuenta , index){
			$scope.tipoCuentaSelected = cuenta.name;
			$scope.tipoCuentaIndex = index;

			if( cuenta.name === '' )
				$scope.clickFilter=false;
			else
				$scope.clickFilter = true;
		};

		$scope.enableEdit = function(array, keytc , valQty ){
			var ok = true;
			// if(array.cuenta){
			// 	if(array.cuenta.length > 0){
			// 		ok = false;
			// 	}
			// }else if(array.subcuenta){
			// 	if(array.subcuenta.length > 0){
			// 		ok = false;
			// 	}
			// }else if(array.detalle){
			// 	if(array.detalle.length > 0){
			// 		ok = false;
			// 	}
			// }

			if(ok){
				if( valQty !== undefined ){
					array.quantityVisible = true;
				}else{
					array.isVisible = true;	
				}
				
				$scope.enabledInput( keytc );		
			}
			
		};

		$scope.onKeypress = function(array,event, keytc){
			if( event.keyCode ===13 || event.keyCode === 9){
				if($scope.tipoCuentaIndex)
					keytc = $scope.tipoCuentaIndex;

				$scope.inputTypeText(array , keytc);
			}
		};

		$scope.onChangeEdit = function(array){
			if($scope.tipoCuentaIndex!== undefined)
				$scope.tipoCuentaSelected = array.name;
		};

		$scope.enabledInput = function( keytc ){
			$timeout(function(){
				$element.find('input[name=inputText]').focus();
			},100);
		};
		
		$scope.onBlur = function (array , keytc){
			array.isVisible = false;
			array.quantityVisible = false;
			$scope.inputTypeText(array , keytc);
		};

		$scope.inputTypeText = function(array, keytc ){
			var newText='';
			if($scope.tipoCuentaIndex)
				keytc = $scope.tipoCuentaIndex;

			array.isVisible = false;
			array.quantityVisible = false;
			array.cantidad = Number(array.cantidad);
			$scope.update($scope.cuentas[keytc]);

			$scope.updateTagTipoCuenta();
			
		};

		//Delete any Item.
		$scope.deleteItem =function (arrayCuenta ) {

			var finded = false;
			var id;
			var index = 0;
			var arraysTipo;
			
			angular.forEach($scope.cuentas, function(tipo, keytipo){
				if(arrayCuenta.cuenta){
					if(arrayCuenta._id+'' === tipo._id){
						finded=true;
						id = tipo._id+'';
						arraysTipo = tipo;
						$scope.cuentas.splice( keytipo, 1);
						arraysTipo.eliminar = 1;
						angular.forEach($scope.inputTagTipoCuenta, function(tag, keytag){
							if(tipo.name === tag.name){
								$scope.inputTagTipoCuenta.splice(keytag, 1);
							}
						});
						index = keytipo; 
					}
				}else{
					if(!finded){
						angular.forEach(tipo.cuenta, function(cuenta, keycuenta){
							if(arrayCuenta.subcuenta){
								if(arrayCuenta._id+'' === cuenta._id+''){
									tipo.cuenta.splice(keycuenta, 1);
									finded=true;
									id = cuenta._id+'';
									angular.forEach($scope.inputTagCuenta[keytipo], function(tag, keytag){
										if(cuenta.name === tag.name){
											$scope.inputTagCuenta.splice(keytag, 1);
										}
									});
									index = keytipo; 
								}
							}else{
								if(!finded){
									angular.forEach(cuenta.subcuenta, function(subcuenta,keysubcuenta){
										if(arrayCuenta.detalle){
											if(arrayCuenta._id+''=== subcuenta._id+''){
												cuenta.subcuenta.splice(keysubcuenta, 1);
												finded=true;
												id = subcuenta._id+'';
												angular.forEach($scope.inputTagSubCuenta[keytipo][keycuenta], function(tag, keytag){
													if(subcuenta.name === tag.name){
														$scope.inputTagSubCuenta[keytipo][keycuenta].splice(keytag, 1);
													}
												});
												index = keytipo; 
											}
										}else{
											if(!finded){
												angular.forEach(subcuenta.detalle, function(detalle, keydetalle){
													if(arrayCuenta._id+''=== detalle._id+''){
														subcuenta.detalle.splice(keydetalle, 1);
														finded=true;
														id = detalle._id+'';
														angular.forEach($scope.inputTagDetalle[keytipo][keycuenta][keysubcuenta], function(tag, keytag){
															if(detalle.name === tag.name){
																$scope.inputTagDetalle[keytipo][keycuenta][keysubcuenta].splice(keytag, 1);
															}
														});
														index = keytipo; 
													}
												});
											}
										}
									});	
								}
							}
						});
					}
				}
			});
			if(finded){
				$scope.tipoCuentaIndex = undefined;
				if($scope.cuentas.length < 1)
					$scope.tipoCuentaSelected = undefined;
				var result;
				if(arraysTipo){
					result = arraysTipo;
				}else{
					result = $scope.cuentas[index];
				}
				$scope.update(result);
			}			
		};
		//Tags
		//TipoCuentas
		$scope.addTag = function() {	
			var ok=true;
			if ( $scope.tagTextTipoCuenta.length === 0 || $scope.tagTextTipoCuenta ) {
				return;
			}else{
				angular.forEach($scope.inputTagTipoCuenta, function(value,key){
					if(value.name.toUpperCase() === $scope.tagTextTipoCuenta.toUpperCase())
					{
						ok=false;
					}
				});
			}
			if(ok){
				$scope.inputTagTipoCuenta.push({ name : $scope.tagTextTipoCuenta });
				$scope.create($scope.tagTextTipoCuenta,function(){
		        	$scope.updateTagTipoCuenta();
		        });
				$scope.tagTextTipoCuenta = '';	
			}
		};

		$scope.deleteTag = function(key, tag) {
			var response;
			if($scope.tagTextTipoCuenta==='')
				$scope.tagTextTipoCuenta = undefined;
			if ($scope.inputTagTipoCuenta.length > 0 && $scope.tagTextTipoCuenta === undefined && key === undefined) {
				tag = $scope.inputTagTipoCuenta[$scope.inputTagTipoCuenta.length-1];
				tag = tag.name;
				$scope.inputTagTipoCuenta.pop();			
			}

			if(tag){
				angular.forEach($scope.cuentas, function(tipo, keytipo){
					if( tipo.name === tag ){
						response = tipo;
					}
				});
				$scope.deleteItem(response);
			}
		};


		$scope.setInputFocus = function(){
			$element.find($scope.textIdInputFocus).focus();
		};

		//Cuentas
		$scope.addTagCuentas = function(keytc, keyc) {	
			var ok=true;
			var valueIndex = $scope.clickFilter ? keytc : keyc;
			var valueTag = $element.find('input[name=tagTextCuenta'+valueIndex+']').val();
			$scope.textIdInputFocus = '#tagTextCuenta'+valueIndex;
			if (valueTag.length === 0) {
				return;
			}else{
				angular.forEach($scope.inputTagCuenta[keyc], function(value,key){
					if(value.name.toUpperCase() === valueTag.toUpperCase())
					{
						ok=false;
					}
				});
			}

			if(ok){
				if(!$scope.inputTagCuenta[valueIndex])
					$scope.inputTagCuenta[valueIndex] = [];
				$scope.inputTagCuenta[valueIndex].push({ name : valueTag});
				if(!$scope.cuentas[valueIndex].cuenta)
				{
					$scope.cuentas[valueIndex].cuenta = [];
				}
		        
		        $scope.cuentas[valueIndex].cuenta.push({
		        	name : valueTag
		        });

		        $scope.update($scope.cuentas[valueIndex],function(){
		        	$scope.updateTagTipoCuenta();
		        });
				
		        $element.find('input[name=tagTextCuenta'+valueIndex+']').val('');
			}	
		};

		$scope.deleteTagCuentas = function(keytc,key,index) {
			var text = $element.find('input[name=tagTextCuenta'+index+']').val();
			var tag, response;

			$scope.textIdInputFocus = '#tagTextCuenta'+index;
			var indexToDelete;
			if(text ==='')				
				text=undefined;

			if ($scope.inputTagCuenta[keytc].length > 0 && text === undefined && key === undefined  ) {
				indexToDelete = $scope.inputTagCuenta[index].length;
				tag = $scope.inputTagCuenta[index][$scope.inputTagCuenta[index].length-1].name;
				$scope.inputTagCuenta[index].pop();
			} else if (key !== undefined) {
				tag = $scope.inputTagCuenta[keytc][key].name;
				$scope.inputTagCuenta[keytc].splice(key, 1);
			}

			if(tag){
				angular.forEach($scope.cuentas[keytc].cuenta, function(tipo, keytipo){
					if( tipo.name === tag ){
						response = tipo;
					}
				});
				$scope.deleteItem(response);
			}
		};

		$scope.addTagSubCuentas = function(keytc, keysc) {	
			var ok=true;
			var valueTag = $element.find('input[name=tagTextSubCuenta'+keytc+'-'+keysc+']').val();
			$scope.textIdInputFocus = '#tagTextSubCuenta'+keytc+'-'+keysc;
			if (valueTag.length === 0) {
				return;
			}else{
				if(!$scope.inputTagSubCuenta[keytc])
					$scope.inputTagSubCuenta[keytc] = [];
				if(!$scope.inputTagSubCuenta[keytc][keysc])
					$scope.inputTagSubCuenta[keytc][keysc]=[];
				if($scope.inputTagSubCuenta[keytc][keysc]){
					angular.forEach($scope.inputTagSubCuenta[keytc][keysc], function(value,key){
						if(value.name.toUpperCase() === valueTag.toUpperCase())
						{
							ok=false;
						}
					});	
				}				
			}

			if(ok){
				$scope.inputTagSubCuenta[keytc][keysc].push({ name : valueTag});
				
				if(!$scope.cuentas[keytc].cuenta[keysc])
				{
					$scope.cuentas[keytc].cuenta[keysc] = [];
				}
		        
		        $scope.cuentas[keytc].cuenta[keysc].subcuenta.push({
		        	name : valueTag,
		        	circles : []
		        });

		        $scope.update($scope.cuentas[keytc],function(){
		        	$scope.updateTagTipoCuenta();
		        });

			}
		};

		$scope.deleteTagSubCuentas = function(keytc , key , index) {
			var text = $element.find('input[name=tagTextSubCuenta'+keytc+'-'+index+']').val();
			$scope.textIdInputFocus = '#tagTextSubCuenta'+keytc+'-'+index;
			var indexToDelete, tag, response;
			if(text ==='')				
				text=undefined;
			var created = true;
			if($scope.inputTagSubCuenta[keytc][index].length === 0 ){
				created = false;
			}

			if (created && $scope.inputTagSubCuenta[keytc][index].length > 0 && text === undefined && key === undefined  ) {
				indexToDelete = $scope.inputTagSubCuenta[keytc][index].length;
				tag = $scope.inputTagSubCuenta[keytc][index][$scope.inputTagSubCuenta[keytc][index].length-1].name;
				$scope.inputTagSubCuenta[keytc][index].pop();
				$element.find('#tagTextSubCuenta'+keytc+'-'+index).focus();
			} else if (key !== undefined) {
				tag = $scope.inputTagSubCuenta[keytc][index][$scope.inputTagSubCuenta[keytc][index].length-1].name;
				$scope.inputTagSubCuenta[keytc][index].splice(key, 1);
			}

			if(tag){
				angular.forEach($scope.cuentas[keytc].cuenta[index].subcuenta, function(tipo, keytipo){
					if( tipo.name === tag ){
						response = tipo;
					}
				});
				$scope.deleteItem(response);
			}
		};

		$scope.addTagDetalle = function(keytc, keyc, keysc) {	
			var ok=true;
			var valueTag = $element.find('input[name=tagTextDetalle'+keytc+'-'+keyc+'-'+keysc+']').val();
			$scope.textIdInputFocus = '#tagTextDetalle'+keytc+'-'+keyc+'-'+keysc;
			if (valueTag.length === 0) {
				return;
			}else{
				if(!$scope.inputTagDetalle[keytc])
					$scope.inputTagDetalle[keytc] = [];
				if(!$scope.inputTagDetalle[keytc][keyc])
					$scope.inputTagDetalle[keytc][keyc]=[];
				if(!$scope.inputTagDetalle[keytc][keyc][keysc])
					$scope.inputTagDetalle[keytc][keyc][keysc] = [];

				if($scope.inputTagDetalle[keytc][keyc]){
					if($scope.inputTagDetalle[keytc][keyc][keysc]){
						angular.forEach($scope.inputTagDetalle[keytc][keyc][keysc], function(value,key){
							if(value.name.toUpperCase() === valueTag.toUpperCase())
							{
								ok=false;
							}
						});	
					}					
				}
			}

			if(ok){
				$scope.inputTagDetalle[keytc][keyc][keysc].push({ name : valueTag});
				if(!$scope.cuentas[keytc].cuenta[keyc].subcuenta[keysc])
				{
					$scope.cuentas[keytc].cuenta[keyc].subcuenta[keysc] = [];
				}
		        
		        $scope.cuentas[keytc].cuenta[keyc].subcuenta[keysc].detalle.push({
		        	name : valueTag,
		        	circles : []
		        });

		        $scope.update($scope.cuentas[keytc],function(){
		        	$scope.updateTagTipoCuenta();
		        });
			}
		};

		$scope.deleteTagDetalle = function(keytc, keyc ,key,index) {
			var text = $element.find('input[name=tagTextDetalle'+keytc+'-'+keyc+'-'+index+']').val();
			$scope.textIdInputFocus = '#tagTextDetalle'+keytc+'-'+keyc+'-'+index;
			var indexToDelete,tag, response;
			if(text ==='')				
				text=undefined;

			if ($scope.inputTagDetalle[keytc][keyc][index].length > 0 && text === undefined && key === undefined  ) {
				indexToDelete = $scope.inputTagDetalle[keytc][keyc][index].length;
				tag = $scope.inputTagDetalle[keytc][keyc][index][$scope.inputTagDetalle[keytc][keyc][index].length-1].name;
				$scope.inputTagDetalle[keytc][keyc][index].pop();
			} else if (key !== undefined) {
				tag = $scope.inputTagDetalle[keytc][keyc][index][$scope.inputTagDetalle[keytc][keyc][index].length-1].name;
				$scope.inputTagDetalle[keytc][keyc][index].splice(key, 1);
			}
			if(tag){
				angular.forEach($scope.cuentas[keytc].cuenta[keyc].subcuenta[index].detalle, function(tipo, keytipo){
					if( tipo.name === tag ){
						response = tipo;
					}
				});
				$scope.deleteItem(response);
			}
		};
		//Finish Tags

		//Wizard Tags
		$scope.cuentasTemp=[];
		$scope.inputTagActivoCirculante = [];
		
		$scope.addTagActivoCirculante = function(){
			if($scope.tagTextActivoCirculante.length === 0)
				{return ;}

			$scope.inputTagActivoCirculante.push({ name : $scope.tagTextActivoCirculante});
			$scope.tagTextActivoCirculante ='';
		};

		$scope.deleteTagActivoCirculante = function( key ) {
			if($scope.tagTextActivoCirculante === '')
				$scope.tagTextActivoCirculante = undefined;
			if ($scope.inputTagActivoCirculante.length > 0 && $scope.tagTextActivoCirculante === undefined && key === undefined  ) {
				$scope.inputTagActivoCirculante.pop();
			} else if (key !== undefined) {
				$scope.inputTagActivoCirculante.splice(key, 1);
			}
		};

		$scope.inputTagActivoFijo = [];
		
		$scope.addTagActivoFijo = function(){
			if($scope.tagTextActivoFijo.length === 0)
				{return ;}

			$scope.inputTagActivoFijo.push({ name : $scope.tagTextActivoFijo});
			$scope.tagTextActivoFijo ='';
		};

		$scope.deleteTagActivoFijo = function( key ) {
			if($scope.tagTextActivoFijo === '')
				$scope.tagTextActivoFijo = undefined;
			if ($scope.inputTagActivoFijo.length > 0 && $scope.tagTextActivoFijo === undefined && key === undefined  ) {
				$scope.inputTagActivoFijo.pop();
			} else if (key !== undefined) {
				$scope.inputTagActivoFijo.splice(key, 1);
			}
		};

		$scope.inputTagActivoDiferido = [];
		
		$scope.addTagActivoDiferido = function(){
			if($scope.tagTextActivoDiferido.length === 0){
				return ;
			}

			$scope.inputTagActivoDiferido.push({ name : $scope.tagTextActivoDiferido});
			$scope.tagTextActivoDiferido ='';
		};

		$scope.deleteTagActivoDiferido = function( key ) {
			if($scope.tagTextActivoDiferido === '')
				$scope.tagTextActivoDiferido = undefined;

			if ($scope.inputTagActivoDiferido.length > 0 && $scope.tagTextActivoDiferido === undefined && key === undefined  ) {
				$scope.inputTagActivoDiferido.pop();
			} else if ( key !== undefined ) {
				$scope.inputTagActivoDiferido.splice(key, 1);
			}
		};
		//Button Next
		$scope.nextActivo = function(){
			if($element.find('#progress-first').css('display') === 'block')
				$scope.ACBlockVisible = true;
			else
				$scope.ACBlockVisible = false;
			
			if($element.find('#progress-second').css('display') === 'block')
				$scope.AFBlockVisible = true;
			else
				$scope.AFBlockVisible = false;
				
			if($element.find('#progress-third').css('display') === 'block')
				$scope.ADBlockVisible = true;
			else
				$scope.ADBlockVisible = false;	

		};

		$scope.activoSubmit = function(){
			$scope.cuentasTemp.push({name:'Activo'});
			//Activo Circulante
			$scope.cuentasTemp[0].cuenta=[];
			$scope.cuentasTemp[0].cuenta.push({name:'Activo Circulante'});
			$scope.cuentasTemp[0].cuenta.push({name:'Activo Fijo'});
			$scope.cuentasTemp[0].cuenta.push({name:'Activo Diferido'});

			angular.forEach($scope.inputTagActivoCirculante, function(value,key){
				if(!$scope.cuentasTemp[0].cuenta[0].subcuenta)
					$scope.cuentasTemp[0].cuenta[0].subcuenta = [];
				$scope.cuentasTemp[0].cuenta[0].subcuenta.push( { name : value.name } );
			});

			
			angular.forEach($scope.inputTagActivoFijo, function(value,key){
				if(!$scope.cuentasTemp[0].cuenta[1].subcuenta)
					$scope.cuentasTemp[0].cuenta[1].subcuenta = [];
				$scope.cuentasTemp[0].cuenta[1].subcuenta.push( { name : value.name } );
			});
			
			
			angular.forEach($scope.inputTagActivoDiferido, function(value,key){
				if(!$scope.cuentasTemp[0].cuenta[2].subcuenta)
					$scope.cuentasTemp[0].cuenta[2].subcuenta = [];
				$scope.cuentasTemp[0].cuenta[2].subcuenta.push( { name : value.name } );
			});
			$scope.showActivo = false;
			$scope.showPasivos = true;			
		};

		$scope.inputTagPasivoCirculante = [];
		
		$scope.addTagPasivoCirculante = function(){
			if($scope.tagTextPasivoCirculante.length === 0)
				{return ;}

			$scope.inputTagPasivoCirculante.push({ name : $scope.tagTextPasivoCirculante});
			$scope.tagTextPasivoCirculante ='';
		};

		$scope.deleteTagPasivoCirculante = function( key ) {
			if($scope.tagTextPasivoCirculante === '')
				$scope.tagTextPasivoCirculante = undefined;
			if ($scope.inputTagPasivoCirculante.length > 0 && $scope.tagTextPasivoCirculante === undefined && key === undefined  ) {
				$scope.inputTagPasivoCirculante.pop();
			} else if (key !== undefined) {
				$scope.inputTagPasivoCirculante.splice(key, 1);
			}
		};

		$scope.inputTagPasivoFijo = [];
		
		$scope.addTagPasivoFijo = function(){
			if($scope.tagTextPasivoFijo.length === 0)
				{return ;}

			$scope.inputTagPasivoFijo.push({ name : $scope.tagTextPasivoFijo});
			$scope.tagTextPasivoFijo ='';
		};

		$scope.deleteTagPasivoFijo = function( key ) {
			if($scope.tagTextPasivoFijo === '')
				$scope.tagTextPasivoFijo = undefined;
			if ($scope.inputTagPasivoFijo.length > 0 && $scope.tagTextPasivoFijo === undefined && key === undefined  ) {
				$scope.inputTagPasivoFijo.pop();
			} else if (key !== undefined) {
				$scope.inputTagPasivoFijo.splice(key, 1);
			}
		};

		$scope.inputTagPasivoDiferido = [];
		
		$scope.addTagPasivoDiferido = function(){
			if($scope.tagTextPasivoDiferido.length === 0)
				{return ;}

			$scope.inputTagPasivoDiferido.push({ name : $scope.tagTextPasivoDiferido});
			$scope.tagTextPasivoDiferido ='';
		};

		$scope.deleteTagPasivoDiferido = function( key ) {
			if($scope.tagTextPasivoDiferido === '')
				$scope.tagTextPasivoDiferido = undefined;
			if ($scope.inputTagPasivoDiferido.length > 0 && $scope.tagTextPasivoDiferidoe === undefined && key === undefined  ) {
				$scope.inputTagPasivoDiferido.pop();
			} else if ( key !== undefined ) {
				$scope.inputTagPasivoDiferido.splice(key, 1);
			}
		};
		//Button Next
		$scope.nextPasivo = function(){
			if($element.find('#progress-first-pasivo').css('display') === 'block')
				$scope.PCBlockVisible = true;
			else
				$scope.PCBlockVisible = false;
			
			if($element.find('#progress-second-pasivo').css('display') === 'block')
				$scope.PFBlockVisible = true;
			else
				$scope.PFBlockVisible = false;
				
			if($element.find('#progress-third-pasivo').css('display') === 'block')
				$scope.PDBlockVisible = true;
			else
				$scope.PDBlockVisible = false;	

		};
		$scope.pasivoSubmit = function(){
			$scope.cuentasTemp.push({name:'Pasivo'});
			//Activo Circulante
			$scope.cuentasTemp[1].cuenta=[];
			$scope.cuentasTemp[1].cuenta.push({name:'Pasivo Circulante'});
			$scope.cuentasTemp[1].cuenta.push({name:'Pasivo Fijo'});
			$scope.cuentasTemp[1].cuenta.push({name:'Pasivo Diferido'});

			angular.forEach($scope.inputTagPasivoCirculante, function(value,key){
				if(!$scope.cuentasTemp[1].cuenta[0].subcuenta)
					$scope.cuentasTemp[1].cuenta[0].subcuenta = [];
				$scope.cuentasTemp[1].cuenta[0].subcuenta.push( { name : value.name } );
			});

			
			angular.forEach($scope.inputTagPasivoFijo, function(value,key){
				if(!$scope.cuentasTemp[1].cuenta[1].subcuenta)
					$scope.cuentasTemp[1].cuenta[1].subcuenta = [];
				$scope.cuentasTemp[1].cuenta[1].subcuenta.push( { name : value.name } );
			});
			
			
			angular.forEach($scope.inputTagPasivoDiferido, function(value,key){
				if(!$scope.cuentasTemp[1].cuenta[2].subcuenta)
					$scope.cuentasTemp[1].cuenta[2].subcuenta = [];
				$scope.cuentasTemp[1].cuenta[2].subcuenta.push( { name : value.name } );
			});

			//insert the first row Activos
			$scope.updateWizard();
		};
		
		$scope.updateWizard = function(){
			$scope.create($scope.cuentasTemp[0].name, function(){
				$scope.create($scope.cuentasTemp[1].name, function(){
					$scope.cuentas[0].cuenta = $scope.cuentasTemp[0].cuenta;
					$scope.update($scope.cuentas[0],function(){
						$scope.cuentas[1].cuenta = $scope.cuentasTemp[1].cuenta;
						$scope.update($scope.cuentas[1],function(){
							$scope.create('Capital',function(){
								$scope.create('Ingreso', function(){
									$scope.create('Egreso', function(){
										$scope.updateTagTipoCuenta();
										$scope.cancelWizard();	
										$scope.msgSmartNotification('Wizard','Se han creado las cuentas usando el wizard.','fa fa-check','#1bbae1');
									});
								});
							});
							
						});
					});
				});
			});
		};

				//CIRCLES OPTIONS
		$scope.onClickLi = function(arrayCuenta, newCircle, circle , tipo, cuenta, subcuenta, detalle){
			$timeout(function(){
				if(tipo !== undefined){
					if(cuenta !== undefined){
						if(subcuenta !== undefined){
							if(detalle !== undefined){
								$element.find('#c-options_'+tipo+'_'+cuenta+'_'+subcuenta+'_'+detalle).addClass('open');	
							}else{
								$element.find('#c-options_'+tipo+'_'+cuenta+'_'+subcuenta).addClass('open');	
							}
						}else{
							$element.find('#c-options_'+tipo+'_'+cuenta).addClass('open');	
						}
					}else{
						$element.find('#c-options_'+tipo).addClass('open');	
					}
				}					
			},100);
			$scope.theStatus = 1;

			if(newCircle === 0){
				$scope.newCircle = false;
				angular.forEach(arrayCuenta.circles, function(circulo,keycirculo){
					if(circulo.idcircle+'' === circle._id+''){
						arrayCuenta.circles.splice(keycirculo,1);
					}
				});

				if(circle.checked){
					circle.checked = false;
				}else {
					arrayCuenta.circles.push({ name : circle.name, idcircle: circle._id, checked: true });
				}

				$scope.update( $scope.cuentas[tipo], function(){
					//$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
					if(tipo !== undefined){
						if(cuenta !== undefined){
							if(subcuenta !== undefined){
								if(detalle !== undefined){
									$scope.fillCircles( $scope.cuentas[tipo].cuenta[cuenta].subcuenta[subcuenta].detalle[detalle] , $scope.arrayCircleDetalle[tipo][cuenta][subcuenta][detalle]);
								}else{
									$scope.fillCircles( $scope.cuentas[tipo].cuenta[cuenta].subcuenta[subcuenta] , $scope.arrayCircleSubCuenta[tipo][cuenta][subcuenta]);
								}
							}else{
								$scope.fillCircles( $scope.cuentas[tipo].cuenta[cuenta] ,  $scope.arrayCircleCuenta[tipo][cuenta]);
							}
						}else{
							$scope.fillCircles($scope.cuentas[tipo], $scope.arrayCircleTipo[tipo]);
						}
					}
				});
			}else if(newCircle === 1){
				$scope.newCircle = true;
				$timeout(function(){
					if(tipo !== undefined){
						if(cuenta !== undefined){
							if(subcuenta !== undefined){
								if(detalle !== undefined){
									$element.find('#newCircleInput_'+tipo+'_'+cuenta+'_'+subcuenta+'_'+detalle).focus();
								}else{
									$element.find('#newCircleInput_'+tipo+'_'+cuenta+'_'+subcuenta).focus();
								}
							}else{
								$element.find('#newCircleInput_'+tipo+'_'+cuenta).focus();
							}
						}else{	
							$element.find('#newCircleInput_'+tipo).focus();
						}
					}
				},100);
			}
		};

		$scope.onKeyPressNewCircle = function(e,cuenta, actual, option ){
			if(e.keyCode === 27){
				$scope.newCircle = false;
				actual.circleName = '';
			}else if(e.keyCode === 13){
				if(actual.circleName !== '' || actual.circleName !== undefined)
					$scope.createCircle(cuenta,actual, option);
			}
		};

		// Create new Circulo
		$scope.createCircle = function(cuenta, actual , option) {
			// Create new Menu object
			var split = option.split('_');
			var tipo = split[1];

			var circulo = new Circulos ( { name : actual.circleName , user: $scope.authentication.user._id } );
			circulo.$save(function(response){
				actual.circleName = '';
				cuenta.circles.push({ name : response.name, idcircle: response._id, checked: true });
				$scope.update($scope.cuentas[tipo], function(){
					$timeout(function(){
						//$scope.find();
						$scope.newCircle = false;
						$timeout(function(){
							$element.find(option).addClass('open');
						},100);
						
					},100);
				});
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};

		//GET AND FILL THE DATA
		$scope.fillCircles = function(response, actual ){
			var contTrue = 0;
			var title = '';

			angular.forEach(actual, function(Tipo, keyTipo){
				angular.forEach( response.circles, function(cir){
					if(Tipo._id+'' === cir.idcircle+''){
						Tipo.checked = true;
						contTrue ++;
						if(contTrue>1)
							title = 'Círculos';
						else
							title = Tipo.name;
					}
				});
			});
			if( contTrue === 1 ){
				actual.total = contTrue;
				actual.title = title;
				actual.showSingle = true;
				actual.showMore = false;
				actual.showNone = false;
			}else if( contTrue > 1 ){
				actual.total = contTrue;
				actual.title = title;
				actual.showSingle = false;
				actual.showMore = true;
				actual.showNone = false;
			}else if( contTrue === 0 ){
				actual.total = contTrue;
				actual.title = title;
				actual.showSingle = false;
				actual.showMore = false;
				actual.showNone = true;
			}
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

		//Config cuentas
		$scope.onSelectOptChange = function(key){
			$timeout(function(){
				$scope.update($scope.cuentas[key]);
			});
		};
	}
]);