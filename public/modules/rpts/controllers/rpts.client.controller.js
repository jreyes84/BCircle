'use strict';

// Rpts controller
angular.module('rpts').controller('RptsController', ['$scope', '$stateParams', '$location', '$http' , '$timeout', 'Authentication', 'Rpts', 'Contactos', 'Cuentas', 'Circulos' , 'DTOptionsBuilder' ,'DTColumnBuilder',
	function($scope, $stateParams, $location, $http, $timeout, Authentication, Rpts, Contactos, Cuentas, Circulos , DTOptionsBuilder, DTColumnBuilder ) {
		$scope.authentication = Authentication;
		$scope.resultados = [];
		$scope.balanceGrl = [];
		$scope.filtros = {};
		$scope.rootFile = undefined;
		// Create new Rpt

		//$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
		//$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
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
			$scope.circles = Circulos.query();
		};

		$scope.findCuentas = function(callback) {
			if($stateParams.documentoId){
				$scope.findOne();
			}
			$scope.inputTagCuentas = [];
		};

		// Find existing Rpt
		$scope.findOne = function() {
			$scope.rpt = Rpts.get({ 
				rptId: $stateParams.rptId
			});
		};

		$scope.send = function(){
			if($scope.selectReporte){
				if($scope.filtros.circle){
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
				}else{
					$scope.error = 'Seleccione un circulo';
					$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
				}
			}else
			{
				$scope.error = 'Seleccione un reporte';
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
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
									cuenta.date_year = val.date_document;
									cuenta.date_monthFull = val.date_document;
									cuenta.date_month = val.date_document;	
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
							cuenta.date_year = val.date_document;
							cuenta.date_monthFull = val.date_document;
							cuenta.date_month = val.date_document;	
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
					DTColumnBuilder.newColumn('name').withTitle('CUENTA'),
					DTColumnBuilder.newColumn('date_year').withTitle('AÑO'),
					DTColumnBuilder.newColumn('date_monthFull').withTitle('MES'),
					DTColumnBuilder.newColumn('date_month').withTitle('MES NO.')
				];
			}).error(function(response){
				console.log(response);
			});
		};

		$scope.balanceGeneral = function(){
			$scope.Activo =[];
			$scope.Pasivo = [];
			$scope.Capital = [];
			
			var initializeYears = function( theYear, array ){
				if(!array.years)
					array.years = [];
				var finded = false;
							
				angular.forEach(array.years,function(years){
					if(years.year === theYear){
						finded= true;
					}
				});

				if(!finded)
					array.years.push({ year : theYear, total : 0 });
			};

			var addTotal = function(array, theYear, quantity){
				angular.forEach(array.years, function(years){
					if(years.year === theYear){
						years.total += quantity;
					}
				});
			};

			var setTotalYears = function( cuentas, tipo, cuenta, subcuenta, theYear , quantity){
				addTotal(cuentas,theYear,quantity);
				addTotal(tipo,theYear,quantity);
				addTotal(cuenta,theYear,quantity);
				addTotal(subcuenta,theYear,quantity);
			};

			//all accounts that has the type : Activo, Pasivo, Capital
			$http.post('/cuentas/listAPC').success(function(cuentas){
				//We get all documents with the selected circle and matching filters.
				$http.post('/rpts/balanceGeneral', $scope.filtros).success(function(response){
					angular.forEach(response, function(doc){
						var date = new Date(doc._id.date_document);
						var year = date.getFullYear();

						initializeYears( year, cuentas );

						angular.forEach(cuentas, function( tipo, keytipo ){							
							initializeYears( year, tipo );
								
							if(!tipo.finded)
								tipo.finded = false;

							if(tipo._id === doc._id.idcuenta){
								tipo.finded = true;
							}else{
								angular.forEach(tipo.cuenta, function( cuenta , keycuenta ){
									if (!cuenta.finded)
										cuenta.finded = false; // this variable is used to mark the account if was finded.
									initializeYears(year, cuenta);
									if(cuenta._id === doc._id.idcuenta){										
										cuenta.finded = true;
										tipo.finded = true;
									}else{
										angular.forEach(cuenta.subcuenta , function( subcuenta, keysubcuenta ){
											var quantity = 0;
											if(!subcuenta.finded)
												subcuenta.finded = false;
											
											initializeYears(year, subcuenta);

											if(subcuenta._id === doc._id.idcuenta){
												if(doc.cargo>0){
													quantity = doc.cargo; //+
												}else{
													quantity = doc.abono; //-
												}

												setTotalYears(cuentas, tipo, cuenta, subcuenta, year,  quantity);
												
												subcuenta.finded = true;
												cuenta.finded = true;
												tipo.finded = true;
											}else{
												angular.forEach(subcuenta.detalle, function( detalle, keydetalle ){
													if(detalle._id === doc._id.idcuenta){
														if( doc.cargo > 0 ){
															quantity = doc.cargo; //+
														}else{
															quantity = doc.abono; //-
														}
														setTotalYears(cuentas, tipo, cuenta, subcuenta, year , quantity);
														subcuenta.finded = true;
														cuenta.finded = true;
														tipo.finded = true;
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
			$scope.filtros = {};
			$scope.selectReporte = undefined;
			$scope.onCheckFilterAccountChange();
			$scope.resultados = [];
			$scope.dtOptionsRes = [];
			$scope.balanceGrl = [];
			$scope.rootFile = undefined;


		};

		$scope.exportToExcel = function(){

			// if ($scope.selectReporte === 'rptIgnis') {
			// 	var data = [];
		 // 	var params;
		 // 	var header;
		 // 	var fields;
		 // 	var delimiter = ',';
		 // 	var nameFile = $scope.selectReporte;
			// switch($scope.selectReporte){
			// 	case 'rptIgnis':
			// 			fields=['name_document','date_document', 'contacts', 'cargoQty' , 'abonoQty','name'];
			// 			header=['Documento','Fecha doc.','Contacto','Cargo','Abono','Cuenta'];
			// 			data = $scope.resultados;
			// 	break;
			// 	case 'balanceGrl' : data = $scope.balanceGrl; header=['']; break;
			// }

			// $http.post('/rpts/exportToCsv' , { data : data , fields : fields,  header : header , nameFile : nameFile } ).success(function(response){
			// 	$scope.rootFile = response.rootFile;
			// 	$scope.msgSmartNotification('Reporte', response.ok ,'fa fa-check','#739E73');
			// 		$scope.isOk = true;	
			// 		$timeout(function () {
	  //               	$scope.isOk = undefined;
	  //           	},1000);
			// }).error(function(errorResponse){

			// });
			// 	}
		};

		$scope.fillListAccountsByCirlce = function(callback){
			var circles = [];

			circles.push($scope.filtros.circle);

			$http.post('/cuentas/listAccountsByCircle',circles).success(function(response){
				$scope.inputTagCuentas = response;
				$scope.onCheckFilterAccountChange();
				if(callback)
					callback();
			}).error(function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		$scope.onCircleChange = function(){
			$scope.fillListAccountsByCirlce();
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
		//Alert Notification UI
		$scope.AlertNotificationCenterForGuests = function(title, content,methods,buttons,type){
			$scope.alertContent = content;
			$scope.alertTitle = title;
			$scope.alertButtons = buttons;
			$scope.alertMethods = methods;

			$scope.hasGuests = true;
			$timeout(function () {
            	$scope.hasGuests = undefined;
        	},100);
		};

		//
		$scope.fillSelectedAccounts = function(response){
			$scope.filtros.cuentasSelected = [];
			if(response!==undefined){
				angular.forEach(response,function(account){
					$scope.filtros.cuentasSelected.push(account._id);
				});	
			}			
		};

		//
		$scope.onCheckFilterAccountChange = function(){
			if($scope.filtros.cuenta){
				$scope.fillSelectedAccounts($scope.inputTagCuentas);	
			}else
			{
				$scope.fillSelectedAccounts();	
			}
			
		};
	}
]);