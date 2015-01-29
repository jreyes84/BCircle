'use strict';

// Historials controller
angular.module('historials').controller('HistorialsController', ['$scope', '$stateParams', '$http', '$timeout' , '$location', 'Authentication', 'Historials', 'Circulos' , 'Contactos',
	function($scope, $stateParams, $http, $timeout, $location, Authentication, Historials, Circulos, Contactos ) {
		$scope.authentication = Authentication;
		$scope.documentos = [];
		$scope.nameCircleFilter = '';
		$scope.nameCircleType = '';
		// Create new Historial
		$scope.create = function() {
			// Create new Historial object
			var historial = new Historials ({
				name: this.name
			});

			// Redirect after save
			historial.$save(function(response) {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Historial
		$scope.remove = function( historial ) {
			if ( historial ) { historial.$remove();
				for (var i in $scope.historials ) {
					if ($scope.historials [i] === historial ) {
						$scope.historials.splice(i, 1);
					}
				}
			} else {
				$scope.historial.$remove(function() {
					$location.path('historials');
				});
			}
		};

		// Update existing Historial
		$scope.update = function() {
			var historial = $scope.historial ;

			historial.$update(function() {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Historials
		$scope.find = function() {
			if($stateParams.historialId){
				$scope.findOne(1);
			}
			else{
				$scope.findOne();
			}			
		};

		$scope.getCirculos = function(callback){
			Circulos.query(function(circulos){
				if(!$scope.circulos)
					$scope.circulos=[];

				angular.forEach(circulos, function(circulo){
					$scope.circulos.push({name: circulo.name, _id: circulo._id , user: circulo.user, visible : false, status : circulo.status, icon:'fa fa-arrow-down', tooltip:'Mostrar menú'});
				});

				if(callback){
					callback();
				}
			});
		};

		// Find existing Historial
		$scope.findOne = function(params) {
			var param; 

			if(params){
				param = { 
					param : [
						{ 'documento.circles.idcircle' : $stateParams.historialId }, 
						{ 'contacto.circles.idcircle' : $stateParams.historialId },
						{ 'usuario.circles.idcircle' : $stateParams.historialId },
						{ 'calendario.circles.idcircle' : $stateParams.historialId }
						],
					sort : '-created'
				};
			}else{
				param = { 
					param : [],
					sort : '-documento.date_document, -created' 
				};
			}
			$http.post('/historials/listById', param ).success(function(resDoc){
				$scope.getCirculos(function(){
					$scope.historials = { logList : [] };
					angular.forEach(resDoc, function(all){ //Documentos, contactos, usuarios, calendario.
						if(all.documento !== null){
							$scope.pushDocumentToLog(all.documento, $scope.historials.logList, all);
							Contactos.query(function(contactos){
								angular.forEach(contactos, function(contacto){
									angular.forEach($scope.historials.logList, function(logslist){
										angular.forEach(logslist.logs, function(logs){
											if(logs.contacto){
												angular.forEach(logs.contacto, function(logContacto, key){
													if(logContacto+''=== contacto._id+''){
														logs.contacto.splice(key,1);
														logs.contacto.push(contacto.razonSocial);
													}
												});
											}
										});
									});
								});
								var type = '';

								angular.forEach(all.documento.cuentas, function(cuentas){
									if( type ==='' ){
										switch(cuentas.typeaccount){
											case 'Egreso': type='Egreso'; break;
											case 'Ingreso': type='Ingreso'; break;
										}	
									}
									
								});

								if( type !=='' ){
									if(type === 'Egreso'){
										all.documento.fromType = type;
										all.documento.icon='gi gi-up_arrow';
									}else{
										all.documento.fromType = type;
										all.documento.icon='gi gi-down_arrow';	
									}
									
								}
							});
						}else if(all.contacto!== null && all.contacto){
							$scope.pushDocumentToLog(all.contacto, $scope.historials.logList, all);
						}else if(all.usuario!== null && all.usuario){
							$scope.pushDocumentToLog(all.usuario, $scope.historials.logList, all);
						}else if(all.calendario!== null && all.calendario){
							$scope.pushDocumentToLog(all.calendario, $scope.historials.logList, all);
						}
					});	
				});
			}).error(function(errorResponse){
			});
		};
		//Push array History Log
		$scope.pushDocumentToLog = function(doc, scopeHistorials, principal, circulo){
			if(principal.active){
				var dt;
				dt = principal.created;
				if(doc.date_document){
					delete doc.created;
				}
				var date = new Date( dt );
				var monthNumber =date.getMonth();
				var month = $scope.dateFormat( date.getMonth() );

				angular.forEach(doc.circles, function(docCircle){ //Doc Circles
					var find = true;
					var index = -1;
					if(scopeHistorials.length>0)
					{				
						angular.forEach( scopeHistorials , function(hLog, klog){
							if( hLog.month === month && hLog.year === date.getFullYear() && hLog.circleName === docCircle.name){

								angular.forEach(hLog.logs, function(myLogs){
									if(myLogs._id +'' === doc._id +'' ){
										find =false;
									}
								});
								if(find){
									index = klog;
								}
							}
						});
					}
					if(find){
						var i;

						if( index > -1 )
							i = index;
						else{
							scopeHistorials.push( { from: principal.from, month : month , monthNumber : monthNumber , year : date.getFullYear(), circleName: docCircle.name } );
							i = $scope.historials.logList.length-1;
							scopeHistorials[i].logs = [];
						}
						scopeHistorials[i].logs.push(doc);
						doc.from = principal.from;
						doc.fromType = '';
						doc.icon = principal.icon;
						doc.userC = {};
						doc.userC = principal.user;
						doc.url = principal.url;
					}
				});
			}
		};
		//Get String month
		$scope.dateFormat = function(month){
			var myDate ='';
			switch(month){
				case 0: myDate='Enero';break;
				case 1: myDate='Febrero';break;
				case 2: myDate='Marzo';break;
				case 3: myDate='Abril';break;
				case 4: myDate='Mayo';break;
				case 5: myDate='Junio';break;
				case 6: myDate='Julio';break;
				case 7: myDate='Agosto';break;
				case 8: myDate='Septiembre';break;
				case 9: myDate='Octubre';break;
				case 10: myDate='Noviembre';break;
				case 11: myDate='Diciembre';break;
			}
			return myDate;
		};

		//Show options circles
		$scope.onClickOptions = function(circulo){
			if(circulo.visible){
				circulo.visible = false;
				circulo.icon = 'fa fa-arrow-down';
				circulo.tooltip = 'Mostrar menú';
				//circulo.class='';
			}				
			else{
				circulo.visible = true;
				circulo.icon = 'fa fa-arrow-up';
				circulo.tooltip = 'Ocultar menú';
				//circulo.class='animation-hatch';
			}

			//clean all except the clicked circle.
			angular.forEach($scope.circulos, function(circle){
				if(circle._id !== circulo._id){
					circle.visible = false;
					circulo.icon = 'fa fa-arrow-down';
					circulo.tooltip = 'Mostrar menú';
				}
			});
				
		};

		$scope.onClickCircleName = function(name, menu, type){
			$scope.nameCircleFilter = name;

			if(menu)
				$scope.nameCircleType = menu;
			else
				$scope.nameCircleType = '';

			if(type)
				$scope.nameCircleTypeDoc = type;
			else
				$scope.nameCircleTypeDoc = '';
		};
	}
]);