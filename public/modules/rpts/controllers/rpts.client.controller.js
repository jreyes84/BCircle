'use strict';

// Rpts controller
angular.module('rpts').controller('RptsController', ['$scope', '$stateParams', '$location', '$http' , '$timeout', 'Authentication', 'Rpts', 'Contactos', 'Cuentas' , 'DTOptionsBuilder' ,'DTColumnBuilder',
	function($scope, $stateParams, $location, $http, $timeout, Authentication, Rpts, Contactos, Cuentas, DTOptionsBuilder, DTColumnBuilder ) {
		$scope.authentication = Authentication;
		$scope.resultados = [];
		$scope.balanceGrl = [];
		$scope.rootFile = undefined;
		// Create new Rpt
		$scope.create = function() {
			// Create new Rpt object
			var rpt = new Rpts ({
				name: this.name
			});

			// Redirect after save
			rpt.$save(function(response) {
				$location.path('rpts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Rpt
		$scope.remove = function( rpt ) {
			if ( rpt ) { rpt.$remove();

				for (var i in $scope.rpts ) {
					if ($scope.rpts [i] === rpt ) {
						$scope.rpts.splice(i, 1);
					}
				}
			} else {
				$scope.rpt.$remove(function() {
					$location.path('rpts');
				});
			}
		};

		// Update existing Rpt
		$scope.update = function() {
			var rpt = $scope.rpt ;

			rpt.$update(function() {
				$location.path('rpts/' + rpt._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rpts
		$scope.find = function() {
			$scope.rpts = Rpts.query();
		};

		$scope.findCuentas = function(callback) {
			if($stateParams.documentoId){
				$scope.findOne();
			}
			$scope.inputTagCuentas = [];
			$http.post('/cuentas/listDetalle').success(function(response){
				$scope.inputTagCuentas = response;
			}).error(function(response){
			});
		};

		// Find existing Rpt
		$scope.findOne = function() {
			$scope.rpt = Rpts.get({ 
				rptId: $stateParams.rptId
			});
		};

		$scope.send = function(){
			if($scope.selectReporte){
				if($scope.filtros.start)
				{
					$scope.filtros.start += ' 00:00:00'; 
				}
				if($scope.filtros.end){
					$scope.filtros.end += ' 23:59:59'; 
				}
				
				$scope.resultados = [];
				$scope.dtOptionsRes = [];
				$scope.balanceGrl = [];
				$scope.rootFile = undefined;

				switch($scope.selectReporte){
					case 'rptIgnis':$scope.resultados = []; $scope.ReporteIgnis(); break;
					case 'balanceGrl' :$scope.balanceGrl=[]; $scope.balanceGeneral(); break;
				}	
			}else
			{
				$scope.error = 'Seleccione un reporte';
			}
		};

		$scope.ReporteIgnis = function(){
			$http.post('/rpts/reporte_1' , $scope.filtros).success(function(response){
				$scope.resultados.totalCargo = 0;
				$scope.resultados.totalAbono = 0;

				if($scope.filtros.cuentasSelected.length > 0){
					angular.forEach($scope.filtros.cuentasSelected, function(selected){
						angular.forEach(response, function( val ){			
							angular.forEach(val.cuentas , function(cuenta){
								if(selected === cuenta.idcuenta){
									cuenta.name_document = val.name_document;
									cuenta.date_document = val.date_document;	
									$scope.resultados.totalCargo += cuenta.cargoQty;
									$scope.resultados.totalAbono += cuenta.abonoQty;
									$scope.resultados.push(cuenta);
								}				
							});
						});					
					});	
				}else{
					angular.forEach(response, function(val){
						angular.forEach(val.cuentas , function(cuenta){
							cuenta.name_document = val.name_document;
							cuenta.date_document = val.date_document;
							cuenta.contactos = [];
							cuenta.contactos.push(val.contacto);
							$scope.resultados.totalCargo += cuenta.cargoQty;
							$scope.resultados.totalAbono += cuenta.abonoQty;
							$scope.resultados.push(cuenta);								
						});
					});
				}
				var result_copy = $scope.resultados;
				Contactos.query(function(contactos){
					angular.forEach(result_copy, function( result , key){
						$scope.resultados[key].contacts = undefined;
						angular.forEach(result.contactos, function(res_contact){
							angular.forEach(res_contact , function(idcontact){
								angular.forEach( contactos , function( contacto ){
									if(idcontact === contacto._id){
										if($scope.resultados[key].contacts !== undefined)
											$scope.resultados[key].contacts += ', '+contacto.razonSocial;
										else
											$scope.resultados[key].contacts = contacto.razonSocial;
									}
								});
							});
						});
					});					
				});
				$scope.dtOptionsRes = DTOptionsBuilder.newOptions();
		        
				$scope.dtColumnsRes = [
					DTColumnBuilder.newColumn('name_document').withTitle('DOCUMENTO'),
					DTColumnBuilder.newColumn('date_document').withTitle('FECHA DOC.'),
					DTColumnBuilder.newColumn('contacts').withTitle('CONTACTO'),
					DTColumnBuilder.newColumn('cargoQty').withTitle('CARGO'),
					DTColumnBuilder.newColumn('abonoQty').withTitle('ABONO'),
					DTColumnBuilder.newColumn('name').withTitle('CUENTA')
				];
			}).error(function(response){
				console.log(response);
			});
		};

		$scope.balanceGeneral = function(){
			$scope.Activo =[];
			$scope.Pasivo = [];
			$scope.Capital = [];
			
			Cuentas.query(function(cuentas){
				$http.post('/rpts/balanceGeneral', $scope.filtros).success(function(response){
					angular.forEach(cuentas, function(tipo){
						angular.forEach(response,function(documentos, kt){
							var encontrado = false;
							if(!encontrado){
								if(documentos._id.name === tipo.name){
									if(documentos.cargo>0){
										//+
										tipo.cantidad += documentos.cargo;
									}else
									{
										//-
										tipo.cantidad -= documentos.abono;
									}
									encontrado = true;
								}else
								{
									if(!encontrado){
										angular.forEach(tipo.cuenta, function(cuenta){
											if(cuenta.name === documentos._id.name){
												if(documentos.cargo>0){
							 						//+
							 						cuenta.cantidad += documentos.cargo;
							 					}else
							 					{
							 						//-
							 						cuenta.cantidad -= documentos.abono;
							 					}
												encontrado= true;
											}else
											{
												if(!encontrado){
													angular.forEach(cuenta.subcuenta, function(subcuenta){
														if(subcuenta.name === documentos._id.name){
															if(documentos.cargo>0){
										 						//+
										 						subcuenta.cantidad += documentos.cargo;
										 					}else
										 					{
										 						//-
										 						subcuenta.cantidad -= documentos.abono;
										 					}
															encontrado = true;
														}else{
															if(!encontrado){
																angular.forEach(subcuenta.detalle, function(detalle){
																	if(detalle.name === documentos._id.name){
																		if(documentos.cargo>0){
													 						//+
													 						detalle.cantidad += documentos.cargo;
													 					}else
													 					{
													 						//-
													 						detalle.cantidad -= documentos.abono;
													 					}
																		encontrado = true;
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
				 			}
						});	
					});
					//With this proccess we selected all accounts that are === 0 
					var deletes =[];
						angular.forEach(cuentas, function(tipo,keytipo){
							if(tipo.cuenta.length>0){
								angular.forEach(tipo.cuenta, function(cuenta,keycuenta){
									if(cuenta.subcuenta.length > 0){
										angular.forEach(cuenta.subcuenta, function(subcuenta, keysubcuenta){
											if(subcuenta.detalle.length>0){
												angular.forEach(subcuenta.detalle, function(detalle, keydetalle){
													if (detalle.cantidad === 0 || !detalle.cantidad )
														deletes.push({name:detalle.name});
												});	
											}
											if (subcuenta.cantidad === 0 || !subcuenta.cantidad ){
												deletes.push({name: subcuenta.name});
											}									
										});
									}
									if( cuenta.cantidad === 0 || !cuenta.cantidad ){
										deletes.push({ name:cuenta.name });
									}																	
								});
							}
							if(tipo.cantidad === 0 || !tipo.cantidad)
								deletes.push({ name:tipo.name });
					});
					//Now we deleted all accounts that we have in the array.
					angular.forEach(deletes, function(value, key){
						var found= false;
						angular.forEach(cuentas, function(tipo,keytipo){
							if(tipo.name === value.name){
								cuentas.splice(keytipo, 1);
								found = true;
							}
							if(!found){
								angular.forEach(tipo.cuenta, function(cuenta,keycuenta){
									if(cuenta.name === value.name){
										tipo.cuenta.splice(keycuenta,1);
										found = true;
									}
									if(!found){
										angular.forEach(cuenta.subcuenta, function(subcuenta, keysubcuenta){
											if(subcuenta.name === value.name){
												cuenta.subcuenta.splice(keysubcuenta,1);
												found=true;
											}
											if(!found){
												angular.forEach(subcuenta.detalle, function(detalle, keydetalle){
													if(detalle.name === value.name){
														subcuenta.detalle.splice(keydetalle,1);
														found=true;
													}
												});		
											}
											
										});				
									}
								});
							}
						});
					});
					$scope.balanceGrl = cuentas;			
				}).error(function(errorResponse){

				});
			});	
		};

		$scope.resetFields = function(){

		};

		$scope.exportToExcel = function(){
			var data = [];
		 	var params;
		 	var header;
		 	var fields;
		 	var delimiter = ',';
		 	var nameFile = $scope.selectReporte;
			switch($scope.selectReporte){
				case 'rptIgnis':
						fields=['name_document','date_document', 'contacts', 'cargoQty' , 'abonoQty','name'];
						header=['Documento','Fecha doc.','Contacto','Cargo','Abono','Cuenta'];
						data = $scope.resultados;
				break;
				case 'balanceGrl' : data = $scope.balanceGrl; header=['']; console.log($scope.balanceGrl); break;
			}

			$http.post('/rpts/exportToCsv' , { data : data , fields : fields,  header : header , nameFile : nameFile } ).success(function(response){
				$scope.rootFile = response.rootFile;
				$scope.msgSmartNotification('Reporte', response.ok ,'fa fa-check','#739E73');
					$scope.isOk = true;	
					$timeout(function () {
	                	$scope.isOk = undefined;
	            	},1000);
			}).error(function(errorResponse){

			});
		};

		$scope.msgSmartNotification = function( title,  content, icon, color){
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;
		};
	}
]);