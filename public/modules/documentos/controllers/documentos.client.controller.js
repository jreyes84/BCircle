'use strict';

// Documentos controller
angular.module('documentos').controller('DocumentosController', ['$scope' , '$http' , '$stateParams', '$element', '$location' , '$timeout', 'Authentication', 'Documentos','Contactos', 'Cuentas', 'Circulos', 'Historials', '$upload', 'x2js', 'DTOptionsBuilder', 'DTColumnBuilder' ,
	function($scope, $http, $stateParams , $element, $location,  $timeout, Authentication, Documentos, Contactos , Cuentas , Circulos, Historials , $upload , x2js, DTOptionsBuilder, DTColumnBuilder ) {
		$scope.authentication = Authentication;
		// Create new Documento
		$scope.options = [
			{ value : 'iva', text : 'IVA'},
			{ value : 'ret_iva', text : 'Retención IVA'},
            { value : 'ret_isr', text : 'Retención ISR'},
            { value : 'ieps', text:'IEPS'}
		];

		$scope.tempFile = undefined;
		$scope.showList = true;
		$scope.whereToCharge = {};
		$scope.whereToCharge.edit = false;
		$scope.whereToCharge.qty = 0;
		$scope.documentos = []; 
		$scope.newContacto = [];
		$scope.newCircle = false;

		$scope.create = function() {
			// Create new Documento object
			$element.find('#save').attr('disabled',true);
			var ok = true;
			if(!$scope.fileXML && !$scope.documento.name_document)
			{
				ok = false;
			}

			if(ok){
				$scope.documento.userCreated = $scope.authentication.user._id;
				var documento = new Documentos ($scope.documento);
				if(documento.items){
					var length = documento.items.length-1;
					var empty ={
						cantidad : 0,
						descripcion : '',
						precio : 0,
						subtotal : 0,
						impuesto : 16,
						total_impuesto : 0,
						total : 0,
						edit : true
					};
					 if(documento.items[length].cantidad === empty.cantidad 
					 	& documento.items[length].descripcion === empty.descripcion 
					 	& documento.items[length].precio === empty.precio
					 	& documento.items[length].subtotal === empty.subtotal
					 	& documento.items[length].total === empty.total
					 	)
					 {
					 	documento.items.splice(length,1);
					 }	
				}
				// // Redirect after save
				documento.$save(function(response) {
					$scope.createHistorial(response, 'Nuevo documento', 'fa fa-file-text', 'documentos/'+response._id);
					$location.path('documentos/' + response._id);
					$scope.documentos = [];
					$scope.templates = [];
					$scope.userid = response._id;
					$scope.documento._id = response._id;
					if(response.xml)
						$scope.documento.xml = response.xml;
					
					if(response.pdf)
						$scope.documento.pdf = response.pdf;
					$scope.uploadXML(function(){
						$scope.uploadPDF(function(){

						});
					});
					$scope.msgSmartNotification('Documento','Se guardo correctamente','fa fa-check','#739E73');
					$scope.isOk = true;	
					$timeout(function () {
	                	$scope.isOk = undefined;
	                	$scope.find();

	            	},1000);
				}, function(errorResponse) {
					$element.find('#save').attr( 'disabled' , false );	
					$scope.msgSmartNotification('Error' , errorResponse.data.message , 'fa fa-frown-o' , '#C46A69' );
					$scope.isOk = false;
					$timeout(function () {
	                	$scope.isOk = undefined;
	            	},1000);
				});	
			}else{
				$element.find('#save').attr('disabled',false);
			}
		};

		$scope.msgSmartNotification = function( title,  content, icon, color){
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;
		};

		$scope.saveDocument = function(){
			if(!$scope.userid)
				$scope.create();
			else
				$scope.update();
		};

		// Remove existing Documento
		$scope.remove = function( documento ) {
			if ( documento ) { documento.$remove();
				for (var i in $scope.documentos ) {
					if ($scope.documentos [i] === documento ) {
						$scope.documentos.splice(i, 1);
					}
				}
			} else {
				$scope.documento.$remove(function() {
					$location.path('documentos');
				});
			}
		};

		$scope.uploadXML = function(callback){
			$scope.typFile = 'xml';
			if( $scope.fileXML ){
				if( $scope.fileXML.length > 0 ){
					$scope.onFileSelect( $scope.fileXML , function(){
						//Once I finish to upload the file
						callback();					
					});	
				}else{
					$element.find('#save').attr('disabled',false);
				}
			}else{
				$element.find('#save').attr('disabled',false);
			}
		};

		$scope.uploadPDF = function(callback){
			$scope.typFile = 'pdf';
			if($scope.filePDF){
				if($scope.filePDF.length>0){
					$scope.onFileSelect( $scope.filePDF , function(){
						$element.find('#save').attr('disabled',false);
					});		
				}else{
					$element.find('#save').attr('disabled',false);
				}
			}else{
				$element.find('#save').attr('disabled',false);
			}
		};

		// Update existing Documento
		$scope.update = function(circle) {
			$element.find('#save').attr('disabled',true);			
			if(!$scope.documento.userUpdated)
				$scope.documento.userUpdated = [];
			
			$scope.documento.userUpdated.push( { id : $scope.authentication.user._id } );

			var documento = new Documentos( $scope.documento );
			var length = documento.items.length-1;
			var empty ={
				cantidad : 0,
				descripcion : '',
				precio : 0,
				edit : true
			};

			 if(documento.items[length].cantidad === empty.cantidad 
			 	& documento.items[length].descripcion === empty.descripcion 
			 	& documento.items[length].precio === empty.precio
			 	)
			 {
			 	documento.items.splice(length,1);
			 }

			 documento.$update(function(response) {
			 	$scope.createHistorial(response, 'Documento actualizado', 'fa fa-file-text', 'documentos/'+response._id );

			 	$location.path('documentos/' + response._id);
				$scope.userid = response._id;
				if($scope.fileXML){
					$scope.uploadXML(function(){
						$scope.uploadPDF(function(){
						});
					});	
				}else{
					$scope.uploadPDF(function(){
					});
				}
				$scope.msgSmartNotification('Documento','Se actualizo correctamente','fa fa-check','#739E73');
				$scope.isOk = true;	
				$timeout(function () {
                	$scope.isOk = undefined;
                	$scope.find();
            	},1000);		
			}, function(errorResponse) {
				$scope.msgSmartNotification('Error' , errorResponse.data.message , 'fa fa-frown-o' , '#C46A69' );
				$scope.isOk = false;
				$timeout(function () {
                	$scope.isOk = undefined;
            	},1000);
			});
		};

		$scope.loadXMLFile = function(path){
			Contactos.query(function(resultContactos){
				$scope.documento._id = $scope.userid;
				$http.get(path).success(function(data){
					var courses  = x2js.xml_str2json(data);
					if(courses.Comprobante){
						angular.forEach( courses, function(complementos){
							$scope.documento.date_document = complementos._fecha;
							if(complementos._serie)
								$scope.documento.name_document = complementos._serie + '' + complementos._folio;
							else
								$scope.documento.name_document = complementos._folio;
							$scope.documento.subtotal = Number(complementos._subTotal);
							$scope.documento.total = Number(complementos._total);
							
							//Cliente Vs contactos see if exists
							var encontrado = false;
							var _idTemp;
							angular.forEach( resultContactos, function( contacto ){
								if( contacto.rfc === complementos.Emisor._rfc){
									encontrado = true;
									_idTemp = contacto._id;
								}								
							});
							
							if(encontrado){
								if( !$scope.documento.contacto ){
									$scope.documento.contacto = [];
								}								
								$scope.documento.contacto.push(_idTemp);
							 }
							else{
								$scope.newContacto.push({
									razonSocial : complementos.Emisor._nombre,
									address : complementos.Emisor.DomicilioFiscal._calle,
									cp : complementos.Emisor.DomicilioFiscal._codigoPostal,
									colonia : [{
										name : complementos.Emisor.DomicilioFiscal._colonia
									}],
									country : complementos.Emisor.DomicilioFiscal._pais,
									comercialName : '',
									rfc : complementos.Emisor._rfc,
									tipocontacto : ['Prospecto']
								});
							}

							//Conceptos
							var ok = false;
							angular.forEach( complementos.Conceptos, function(conceptos){
								if(!$scope.documento.items)
									$scope.documento.items = [];
								if(conceptos._cantidad){
									$scope.documento.items.push({
										cantidad : Number(conceptos._cantidad),
										descripcion : conceptos._descripcion,
										precio : Number(conceptos._valorUnitario),
										importe : Number(conceptos._importe)
									});
									ok = false;
								}

								if(!ok){
									if(conceptos  instanceof Array){
										angular.forEach ( conceptos, function(concepto){
											$scope.documento.items.push({
												cantidad : Number(concepto._cantidad),
												descripcion : concepto._descripcion,
												precio : Number(concepto._valorUnitario),
												importe : Number(concepto._importe)
											});
										});
									}
								}
							});
							if(complementos.Impuestos._totalImpuestosTrasladados)
								$scope.documento.totalImpuestosTrasladados = Number(complementos.Impuestos._totalImpuestosTrasladados);
							if(complementos._descuento)
								$scope.documento.descuento = - (Number(complementos._descuento));

							angular.forEach(complementos.Impuestos.Traslados, function(traslado){
								if(!$scope.documento.traslados)
									$scope.documento.traslados = [];

								if(traslado instanceof Array){
									angular.forEach( traslado, function(aTraslado){
										$scope.documento.traslados.push( { impuesto : aTraslado._impuesto.toLowerCase(),
																	tasa : Number(aTraslado._tasa),
																	importe : Number(aTraslado._importe) });
									});	
									ok = true;
								}else{
									if(!ok){
										$scope.documento.traslados.push( { impuesto : traslado._impuesto.toLowerCase(),
																	tasa : Number(traslado._tasa),
																	importe : Number(traslado._importe) });		
									}
									
								}
								
							});
						});
						$scope.cargos_abonos();
					}else{
						$scope.msgSmartNotification('Error','El formato del XML no es correcto','fa fa-frown-o' , '#C46A69');
						$scope.isOk = true;	
						$timeout(function () {
		                	$scope.isOk = undefined;
		                	$scope.find();
		            	},1000);
					}
				}).error(function(err){
				});
			});
		};

		// Find a list of Documentos //Total y Descripcion
		$scope.find = function(callback) {
			console.log($stateParams.documentoId);
			if($stateParams.documentoId){
				$scope.findOne();
			}

			Documentos.query(function(response){
				/*angular.forEach(response,function(value){
					var cuentaDoc =[];

					var ok=true;
					angular.forEach(value.cuentas, function(cuenta){
						if(ok){
							if(cuentaDoc.length<2)
								cuentaDoc.push({name:cuenta.name});
							else{
								cuentaDoc.push({name : '+3'});
								ok= false;
							}
						}						
					});
					value.cuentaDoc = cuentaDoc;
				});*/
				
				if(!response.contacto)
					response.contacto={};

				$scope.documentos = response ;

				var result_copy = response;

				Contactos.query(function(contactos){
					//Fill contactos.
					angular.forEach(result_copy, function( result , key){
						$scope.documentos[key].contacts = [];
						angular.forEach(result.contacto, function(res_contact){
							angular.forEach( contactos , function( contacto ){
								if(res_contact === contacto._id){
									$scope.documentos[key].contacts.push(contacto.razonSocial);
								}
							});
						});
					});	
					
					$scope.dtOptions = DTOptionsBuilder.newOptions();
					$scope.dtColumns = [
						DTColumnBuilder.newColumn('date_document').withTitle('FECHA'),
						DTColumnBuilder.newColumn('name_document').withTitle('DOCUMENTO'),
						DTColumnBuilder.newColumn('date_end').withTitle('FECHA VENCIMIENTO'),
						DTColumnBuilder.newColumn('razon').withTitle('RAZÓN SOCIAL'),
						DTColumnBuilder.newColumn('subtotal').withTitle('SUBTOTAL'),
						DTColumnBuilder.newColumn('totalImpuestosTrasladados').withTitle('IMPUESTO'),
						DTColumnBuilder.newColumn('total').withTitle('TOTAL'),
						// DTColumnBuilder.newColumn('circles').withTitle('CÍRCULOS'),
						DTColumnBuilder.newColumn('opcion').withTitle('OPCION')
					];
					$scope.inputTagContactos = [];
					angular.forEach(contactos, function( val , key ){
						$scope.inputTagContactos.push( { id : val._id , text : val.razonSocial + ' - ' + val.comercialName } );
					});

					$scope.inputTagCuentas = [];
					$scope.fillListCuentas(callback);
				});
			});			
		};

		$scope.fillListCuentas = function(callback){
			var circles = [];
			angular.forEach($scope.circulos, function(circle){
				if(circle.checked)
					circles.push(circle);
			});

			if(circles.length< 1){
				if(!$scope.circulos)
					$scope.circulos = [];
				$scope.circulos.total = 0;
				$scope.circulos.title = '';
			}
			
			$http.post('/template-movimientos/listTemplatesAndCuentas',circles).success(function(template){
				$scope.inputTagCuentas = template;
				if(callback)
					callback();

				$scope.fillAllCircles($scope.documento);
			}).error(function(errorResponse){
			});
		};

		// Find existing Documento
		$scope.findOne = function() {
			Documentos.get({
				documentoId: $stateParams.documentoId
			},function(response){
				$scope.showList = false;
				$scope.userid = response._id;
				$scope.documento = response;
				Circulos.query(function(circulos){
					$scope.circulos = [];
					angular.forEach(circulos,function(circulo){
						$scope.circulos.push({ name : circulo.name, _id : circulo._id, checked : false });
					});
					$scope.fillAllCircles(response);
				});
			});
		};

		$scope.fillAllCircles = function(response){
			var contTrue = 0;
			var title = '';
			if(response){
				if(response.circles){
					angular.forEach(response.circles, function(cir){
						angular.forEach($scope.circulos, function(value){
							if(value._id+'' === cir.idcircle+''){
								value.checked = true;
								contTrue ++;
								if(contTrue>1)
									title = 'Círculos';
								else
									title = value.name;
							}
						});
					});
				}
			}
			$scope.circulos.total = contTrue;
			$scope.circulos.title = title;
			if(contTrue === 0){
				$scope.circulos.showNone = true;
				$scope.circulos.showSingle = false;
				$scope.circulos.showMore = false;
			}else if(contTrue === 1){
				$scope.circulos.showNone = false;
				$scope.circulos.showSingle = true;
				$scope.circulos.showMore = false;
			}else if( contTrue > 1 ){
				$scope.circulos.showNone = false;
				$scope.circulos.showSingle = false;
				$scope.circulos.showMore = true;
			}
		};

		$scope.addItemToTable = function(){
			if($scope.documento.items === undefined)
				$scope.documento.items = [];
			$scope.documento.items.push({
				cantidad : 0,
				descripcion : '',
				precio : 0,
				subtotal : 0,
				impuesto : 16,
				total_impuesto : 0,
				total : 0,
				edit : true
			});
			$scope.documento.traslados=[];
		};

		$scope.editField = function( item, value, event){
			if(event !== undefined){
				if(event.charCode === 13){
					if(item !== undefined){
						item.edit = value;	
						$scope.addItemToTable();
						$scope.onChangeFootItems(item);
					}else{
						$scope.onChangeFootItems(item);
					}					
				}
			}else
			{
				item.edit = value;
				$scope.onChangeFootItems();
			}
		};

		$scope.onChangeFootItems = function(item){
			if(item){
				if(item.cantidad <= 0)
					item.cantidad = 1;	
			}
			
			$scope.documento.subtotal = 0;
			angular.forEach($scope.documento.items, function(item){
				$scope.documento.subtotal += (item.cantidad * item.precio);
			});

			// if($scope.documento.descuento)
			// 	$scope.documento.total +=- $scope.documento.descuento; 
			var impuesto = Number($scope.documento.subtotal);
			angular.forEach($scope.documento.traslados, function(traslado){
				$scope.onTasaChange(traslado,false);
			});
			angular.forEach($scope.documento.traslados, function(traslado){
				impuesto += Number(traslado.importe);
			});

			$scope.documento.total = impuesto;	
			$scope.cargos_abonos();		
		};

		$scope.onTasaChange = function(traslado,value){
			traslado.importe = $scope.documento.subtotal * (traslado.tasa / 100);
			if(value)
				$scope.onChangeFootItems();
		};

		$scope.deleteFields = function( item , index ){
			$scope.documento.items.splice(index,1);
			$scope.onChangeFootItems();
		};

		$scope.onCuentasChange = function(selected, deselected){
			if(!$scope.documento.cuentas)
				$scope.documento.cuentas = [];

			if(selected !== undefined){
				var id = [selected.id];
				$http.post( '/template-movimientos/listCuentasFromTemplates' , id ).success( function( response ){
					var ok =true;
					var found = false;
					var temMov = [];
					angular.forEach($scope.documento.cuentas, function(m){
						temMov.push(m);
					});
					var find = false;
					angular.forEach($scope.circulos,function(circle){
						if(!find){
							angular.forEach(response, function(result){
								angular.forEach(result.circles, function(r_circle){
									if(r_circle.idcircle + '' === circle._id + '' ){
										find = true;
										var ok = false;
										angular.forEach($scope.documento.circles, function(doc){
											if(doc.idcircle+'' === r_circle.idcircle+''){
												ok = true;
											}
										});
										if(!ok)
											$scope.documento.circles.push({idcircle:circle._id, name: circle.name , checked : true});
									}
								});
							});
						}
					});

					if(find){
						$scope.fillAllCircles($scope.documento);
					}

					angular.forEach( response , function( res ){
						angular.forEach( temMov , function( mov, key ){
							if( res.idcuenta === mov.idcuenta ){
								if( !res.cargo && !res.abono){
									ok = false;
									found = true;
								}else if( !res.cargo || !res.abono ){
									angular.forEach($scope.templates, function(val,k){
										if(val === res.idcuenta+'')
											$scope.templates.splice( k , 1 );
									});
									
									$scope.documento.cuentas.splice( key , 1 );
									ok = true;
								}
							}else{
								ok = true;
							}
						});	

						if(ok){
							if(!found){

								$scope.documento.cuentas.push(res);
							 } //else{
							// 	angular.forEach($scope.templates, function(val,k){
							// 		//if(val === res.id+'')
							// 		//	$scope.templates.splice( k , 1 );
							// 	});
							// }
						}							
					});

					$scope.cargos_abonos();
				}).error(function(errorResponse){
	
				});	
			}
		};

		$scope.deleteCuentaMov = function(index){
			$scope.documento.cuentas.splice( index , 1 );
			$scope.cargos_abonos();
		};

		$scope.clickEdit = function( movimiento ){
			if(!movimiento.edit)
			{
				movimiento.edit = true;
				$scope.whereToCharge.edit = true;
				$scope.whereToCharge.qty++;
			}else{
				movimiento.edit = false;
				$scope.whereToCharge.qty--;
				if($scope.whereToCharge.qty === 0 )
					$scope.whereToCharge.edit = false;
				$scope.cargos_abonos();
			}
		};

		$scope.cargos_abonos = function(){
			//Hacer los cargos
			angular.forEach( $scope.documento.cuentas , function( value ){
				value.cargoQty = 0;
				value.abonoQty = 0;
			});

			angular.forEach($scope.documento.cuentas, function( value , key ){
					if( value.cargo ){
						switch( value.cargo_a ){
							case 'total': value.cargoQty += Number($scope.documento.total); break;
							case 'subtotal': value.cargoQty += Number($scope.documento.subtotal); 
							if($scope.documento.descuento)
								value.cargoQty += Number($scope.documento.descuento);
							break;
							case 'iva' :
								angular.forEach( $scope.documento.traslados , function(traslado){
									switch( traslado.impuesto.toLowerCase()){
										case 'iva' : value.cargoQty += Number(traslado.importe) ; break;
										case 'ret_iva' : value.cargoQty += Number(traslado.importe) ; break;
										case 'ret_isr' : break;
									}
								});
							break;
						}
						
					}else
					{
						switch(value.cargo_a){
							case 'total': value.abonoQty += Number($scope.documento.total); break;
							case 'subtotal': value.abonoQty += Number($scope.documento.subtotal); break;
							case 'iva': 
								angular.forEach( $scope.documento.traslados , function(traslado){
									switch( traslado.impuesto.toLowerCase()){
										case 'iva' : value.abonoQty += Number(traslado.importe); break;
										case 'ret_iva' : value.abonoQty += Number(traslado.importe); break;
										case 'ret_isr' : break;
									}
								});
							break;
						}
						
					}					
			});			
		};

		$scope.showDetail = function( doc ){
			$scope.showList = false;
			$scope.documento = doc;
			$scope.userid = doc._id;
		};

		$scope.cancelDetail = function(){
			$scope.showList = true;
			$scope.userid = undefined;
			$scope.documento = [];
			$scope.fileXML = undefined;
			$scope.filePDF = undefined;
			$scope.cleanFilesInput();
		};

		$scope.cleanFilesInput = function(){
			angular.forEach( angular.element('input[type="file"]') , function(inputElem) {
		    	angular.element(inputElem).val(null);
		    });
		};

		$scope.addDocument = function(){
			$scope.showList = false;
			$scope.userid = undefined;
			$scope.documento = new Documentos();
			$stateParams.documentoId = undefined;
			$scope.documento.contacto =[];
			$scope.fileXML = undefined;
			$scope.filePDF = undefined;
			$scope.cleanFilesInput();
			Circulos.query(function(circulos){
				$scope.circulos = [];
				angular.forEach(circulos,function(circulo){
					$scope.circulos.push({ name : circulo.name, _id : circulo._id, checked : false });
				});
				$scope.fillAllCircles($scope.documento);
			});
		};

		//Upload files documents

		$scope.uploadRightAway = true;
		
		$scope.hasUploader = function (index) {
        	return $scope.upload[index] !== null;
    	};
	    
	    $scope.abort = function (index) {
	        $scope.upload[index].abort();
	        $scope.upload[index] = null;
	    };

	    $scope.copyFilesXML = function($files){
	    	$scope.fileXML = $files;
	    	$scope.myFiles();
	    	
	    };

	    $scope.copyFilesPDF = function($files){
	    	$scope.filePDF = $files;
	    };

	    $scope.onFileSelect = function ($files, callback) {
	        $scope.selectedFiles = [];
	        $scope.progress = [];
	        if ($scope.upload && $scope.upload.length > 0) {
	            for (var i = 0; i < $scope.upload.length; i++) {
	                if ($scope.upload[i] !== null) {
	                    $scope.upload[i].abort();
	                }
	            }
	        }
	        $scope.upload = [];
	        $scope.uploadResult = [];
	        $scope.selectedFiles = $files;
	        $scope.dataUrls = [];
	        for (var j = 0; j < $files.length; j++) {
	            var $file = $files[j];
	            if (window.FileReader && $file.type.indexOf('image') > -1) {
	                var fileReader = new FileReader();
	                fileReader.readAsDataURL($files[j]);

	                $scope.setPreview(fileReader, j);
	            }
	            $scope.progress[j] = -1;
	            if ($scope.uploadRightAway) {
	                $scope.start( j , callback );
	            }
	        }
	    };

	    $scope.setPreview = function (fileReader, index) {
	        fileReader.onload = function (e) {
	            $timeout(function () {
	                $scope.dataUrls[index] = e.target.result;
	            });
	        };
		};

	    $scope.start = function (index, callback) {
	        $scope.progress[index] = 0;
	        $element.find('div[name=progressBar]').css({'display':'block'});
	        $element.find('div[name=progress]')
	        .css({'width':'0%'})
	        .text('0%')
	        .attr('aria-valuenow',0);
	        if($scope.typFile === 'pdf')
	        	$scope.tempFile = undefined;
	        $scope.upload[index] = $upload.upload({
	            url: '/documentos/uploadFile',
	            headers: {'myHeaderKey': 'myHeaderVal'},
	            data: {
	                userid : $scope.userid,
	                where : $scope.typFile,
	                tempPath : $scope.tempFile
	            },
	            file: $scope.selectedFiles[index],
	            fileFormDataName: 'myFile'
	        }).then(function ( response ) {
	            $element.find('div[name=progressBar]').css('display','none');
	            $scope.upload=[];
	            if(callback){
	            	callback();
	            }
	            
	        }, null, function (evt) {
	            $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
	            $element.find('div[name=progress]')
	            .text(parseInt(100.0 * evt.loaded / evt.total) + '%')
	            .attr('aria-valuenow',parseInt(100.0 * evt.loaded / evt.total))
	            .css( 'width' , parseInt(100.0 * evt.loaded / evt.total) +'%' );

	        });
	    };

	    $scope.myFiles = function(){
	    	$scope.uploads = $upload.upload({
	            url : '/documentos/watchFile',
	            headers : { 'myHeaderKey' : 'myHeaderVal'},
	            data : {
	            },
	            file : $scope.fileXML[0],
	            fileFormDataName : 'myFile'
	        }).then(function ( response ) {
	        	$scope.tempFile = undefined;
	        	$scope.tempFile = response.data;
	        	$scope.documento.items = [];
	            $scope.loadXMLFile($scope.tempFile.replace('public/',''));
	            $scope.uploads=[];
	        }, null, function (evt) {
	        });
	    };

	    $scope.onAddImpuesto = function(){
	    	if(!$scope.documento.traslados){
	    		$scope.documento.traslados = [];
	    		$scope.documento.traslados.push( { impuesto : 'iva', tasa : 0, importe : 0 });
	    	}else{
	    		$scope.documento.traslados.push( { impuesto : '', tasa : 0, importe : 0 });
	    	}
	    	$scope.cleanValuesSelects();
	    };

	    $scope.cleanValuesSelects = function(){
	    	$timeout(function () {
	    		$element.find('select[name="selectImpuesto"]').attr('disabled',false);
				angular.forEach($scope.options, function(value){
	    			$element.find('select[name="selectImpuesto"] > option[value="'+ value.value + '"]').attr('disabled',false); 
	    		});

	    		$timeout(function () {
					angular.forEach($scope.documento.traslados, function(value){
		    			$element.find('select[name="selectImpuesto"] > option[value="'+ value.impuesto + '"]').attr('disabled',true); 
		    		});
		        },100);
	        },100);
	    };

	    $scope.onRemoveImpuesto = function(value,index){
	    	$element.find('select[name="selectImpuesto"] > option[value="'+ value.impuesto + '"]').attr('disabled',false); 
	    	$scope.documento.traslados.splice(index,1);
	    	if($scope.documento.traslados.length === 0){
	    		$scope.documento.traslados.push( { impuesto : '', tasa : 0, importe : 0 });
	    	}
	    };

	    $scope.copyDocument = function(){
	    	$scope.userid = undefined;
	    	$scope.showList = false;
			$scope.documento.name_document = undefined;
			$scope.documento.pdf = undefined ;
			$scope.documento.xml = undefined ;
			$scope.documento._id = undefined;
			$scope.cleanFilesInput();
	    };

	    $scope.saveNewContact = function(){
	    	$scope.newContacto[0].notify = true;
	    	var contacto = new Contactos($scope.newContacto[0]);

	    	contacto.$save(function(response) {
				$scope.inputTagContactos.push( { id : response._id , text : response.razonSocial + ' - ' + response.comercialName } );
	    		$scope.msgSmartNotification('Contactos','Has agregado un nuevo contacto, recuerda mantener todos sus campos actualizados.','fa fa-bell swing animated','#3276B1');
				$scope.isOk = true;	
				
				$timeout(function () {
                	$scope.isOk = undefined;
                	if( !$scope.documento.contacto ){
						$scope.documento.contacto = [];
					}								
					$scope.documento.contacto.push(response._id);
            	},1000);
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error','No se pudo agregar el contacto: '+ $scope.error,'fa fa-frown-o','#C46A69');
	            $scope.isOk = false;	
				$timeout(function () {
                	$scope.isOk = undefined;
            	},1000);
			});
	    	$scope.newContacto = [];
	    };

	    $scope.createContact = function() {
			// Create new Contacto object
			$scope.credentials.colonia = [];	
			$scope.credentials.colonia.push($scope.coloniaSelected);
			
			var contacto = new Contactos ( $scope.credentials );

			// Redirect after save
			contacto.$save(function(response) {				
				$scope.msgSmartNotification('Contactos','Se guardo correctamente','fa fa-check','#739E73');
				$scope.inputTagContactos.push({ id : response._id , text : response.razonSocial + ' - ' + response.comercialName });
	            $scope.isOk = true;	
	            $scope.credentials = [];
				$timeout(function () {
					$scope.documento.contacto.push(response._id);
                	$scope.isOk = undefined;
            	},100);
			
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error','No se guardo correctamente: '+ $scope.error,'fa fa-frown-o','#C46A69');
	            $scope.isOk = false;	
				$timeout(function () {
                	$scope.isOk = undefined;
            	},1000);
			});
		};

		//CIRCLES OPTIONS
		$scope.onClickLi = function(index, newCircle, circle){
			$timeout(function(){
				$element.find('#c-options').addClass('open');	
			});

			if(newCircle === 0){
				$scope.newCircle = false;

				if(circle.checked)
					circle.checked = false;
				else
					circle.checked = true;
					
					$scope.updateCirclesDocument();
					$scope.fillListCuentas();
				
			}else if(newCircle === 1){
				$scope.newCircle = true;
				$timeout(function(){
					$element.find('#newCircleInput').focus();
				});
			}
		};

		$scope.onKeyPressNewCircle = function(e){
			if(e.keyCode === 27){
				$scope.newCircle = false;
				$scope.documento.circleName = '';
			}else if(e.keyCode === 13){
				if($scope.documento.circleName !== '' || $scope.documento.circleName !==undefined)
					$scope.createCircle();
			}
		};

		$scope.clicked = function(){
			$scope.createCircle();
		};

		// Create new Circulo
		$scope.createCircle = function() {
			// Create new Menu object
			var circulo = new Circulos ( { name : $scope.documento.circleName , user: $scope.authentication.user._id } );
			circulo.$save(function(response){
				$scope.circulos.push(response);
				$scope.circulo = null;
				$scope.documento.circleName = '';
				$scope.documento.circles.push({ name : response.name, idcircle: response._id, checked: true });
				if($stateParams.documentoId)
					$scope.update($scope.documento);
				else{
					if($scope.documento.name_document){
						if($scope.documento.name_document!=='')
							$scope.update($scope.documento);	
					}
				}
				$scope.fillListCuentas();
				$scope.newCircle = false;
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};

		$scope.updateCirclesDocument = function(){
			$scope.documento.circles = [];
			angular.forEach($scope.circulos, function(circle){
				if(circle.checked){
					$scope.documento.circles.push({idcircle : circle._id, name: circle.name, checked: circle.checked });
				}
			});
		};
		//END CIRCLE OPTIONS

		/*Historials*/
		// Create new Historial
		$scope.createHistorial = function(response, typemov, icon, url ) {
			// Create new Historial object
			var historial = new Historials ({
				typemov : typemov,
				icon : icon,
				url : url,
				created : response.date_document,
				user: $scope.user._id,
				from : 'Documentos'
			});
			historial.documento = response;
			// Redirect after save
			historial.$save(function(response){
				console.log(response);
			}, function(errorResponse) {
				console.log(errorResponse.data.message);
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};
	}
]);