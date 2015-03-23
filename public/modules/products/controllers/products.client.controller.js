'use strict';

// Products controller
angular.module('products').controller('ProductsController', [
	'$scope', '$http' , '$stateParams', '$location' , '$element' , '$timeout', 'Authentication', 'Products', 'Contactos' , 'Grupoproductos', 'Historials' , '$upload', 'Documentos',
	function($scope , $http , $stateParams, $location, $element ,  $timeout , Authentication, Products , Contactos , Grupoproductos, Historials ,  $upload , Documentos ) {
		$scope.authentication = Authentication;
		$scope.blockNew = false;
		$scope.blockEdit = false;
		$scope.field = 'name';
		$scope.findMeByText = 'Nombre';
		$scope.letter='';
		$scope.itemsByPage = 10;
		$scope.showStatusValidateDocument = false;
		$scope.showEditFields = false;
		$scope.originalProducts =[];
		$scope.statusAll = [
			{ id : 'No recibido', text:'No recibido'},
			{ id : 'Recibido',	  text:'Recibido'   }
		];
		$scope.statusProduct = [
			{ id : 'No recibido', text:'No recibido'},
			{ id : 'Recibido',	  text:'Recibido'   },
			{ id : 'Defectuoso',  text:'Defectuoso' },
		];

		$scope.inputTagSeries =[];

		// Create new Product
		$scope.create = function() {
			// Create new Product object
			var product;
			if($scope.producto)
				product = new Products ($scope.producto);
			else{
				product = new Products ($scope.newProduct);
			}				

			if(product._id){
				$scope.update(product);
			}else{
				// Redirect after save
				product.$save(function(response) {
					$scope.msgSmartNotification('Productos','Producto agregado correctamente','fa fa-check','#739E73');
					$scope.products.push(response);
					$scope.showEditFields = false;
					$scope.userid = response._id;
					if($scope.avatar){
						$scope.onFileSelect($scope.avatar, function(){
			            	$scope.producto = [];						
						});
					}else{
			            $scope.isOk = true;	
					}
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
					$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
				});
			}
		};

		// Update existing Product
		$scope.update = function(product) {
			
			if($scope.producto){
				if(product.proveedor)
					product.proveedor = product.proveedor._id;
			}else if($scope.product){
				angular.forEach(product.precio_compra,function(precio_compra){
					if(precio_compra.id_proveedor)
					{
						if(precio_compra.id_proveedor._id)
							precio_compra.id_proveedor = precio_compra.id_proveedor._id;
					}
						
				});

				angular.forEach(product.precio_venta.proveedor,function(precio_venta){
					precio_venta.id_proveedor = precio_venta.id_proveedor._id;
				});
			}
			product = new Products (product);
			
			product.$update(function(response) {
				$scope.userid = response._id;
				$scope.showEditFields = false;

				$scope.msgSmartNotification('Productos','Producto actualizado correctamente','fa fa-check','#739E73');
				if($scope.avatar){
					$scope.onFileSelect($scope.avatar,function(){});
				}
				$scope.displayedCollection =[];
				$scope.showStatusValidateDocument = false;
				if($scope.producto)
					$scope.find();
				else
					$scope.findOne();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		// Find a list of Products
		$scope.find = function() {
			Products.query(function(products){
				$scope.products = products;
				$scope.originalProducts = products;
				$scope.displayedCollection = [].concat($scope.products);
			});

			$scope.fillContacts();
		};

		// Find existing Product
		$scope.findOne = function() {
			var id = { id: $stateParams.productId };
			$http.post('/products/getProduct' , id ).success(function(response){
				$scope.product = response;				
			}).error(function(errorResponse){

			});
		};

		//Fill contacts
		$scope.fillContacts = function(){
			Contactos.query(function(contactos){
				$scope.inputTagContactos = [];
				$scope.inputTagContactos2 = [];
				angular.forEach(contactos, function( val , key ){
					$scope.inputTagContactos.push( { id : val._id , text : val.razonSocial + ' - ' + val.comercialName } );
					$scope.inputTagContactos2.push( { id : val._id , text : val.razonSocial + ' - ' + val.comercialName } );
				});
			});
		};

		$scope.fillContacts2 = function(){
			Contactos.query(function(contactos){
				$scope.inputTagContactos2 = [];
				angular.forEach(contactos, function( val , key ){
					$scope.inputTagContactos2.push( { id : val._id , text : val.razonSocial + ' - ' + val.comercialName } );
				});
			});
		};

		//fillGroups
		$scope.fillAllGrupos = function(response){
			var contTrue = 0;
			var title = '';
			$scope.grupos = [];
			Grupoproductos.query(function(grupos){
				$scope.grupos = grupos;
				if(response){
					if(response.grupos){
						angular.forEach(response.grupos, function(cir){
							angular.forEach($scope.grupos, function(value){
								if(value._id+'' === cir.id+''){
									value.checked = true;
									contTrue ++;
									if(contTrue>1)
										title = 'Grupos';
									else
										title = value.name;
								}
							});
						});
					}
				}
				$scope.grupos.total = contTrue;
				$scope.grupos.title = title;
				if(contTrue === 0){
					$scope.grupos.showNone = true;
					$scope.grupos.showSingle = false;
					$scope.grupos.showMore = false;
				}else if(contTrue === 1){
					$scope.grupos.showNone = false;
					$scope.grupos.showSingle = true;
					$scope.grupos.showMore = false;
				}else if( contTrue > 1 ){
					$scope.grupos.showNone = false;
					$scope.grupos.showSingle = false;
					$scope.grupos.showMore = true;
				}
			});
		};

		//SmartNotifications
		$scope.msgSmartNotification = function( title,  content, icon, color, time){
			if (!time) {
				time = 1000;
			}
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;

			$scope.isOk = true;	
			$timeout(function () {
            	$scope.isOk = undefined;
        	},time);
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

		//CIRCLES OPTIONS
		$scope.onClickLi = function(index, newCircle, grupo){
			$timeout(function(){
				$element.find('#c-options').addClass('open');	
			});

			if(newCircle === 0){
				$scope.newCircle = false;

				if(grupo.checked)
					grupo.checked = false;
				else
					grupo.checked = true;
					
					$scope.updateGroupsArray();	
					$scope.fillAllGrupos($scope.producto);			
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
				$scope.circleName = '';
			}else if(e.keyCode === 13){
				if($scope.circleName !== '' || $scope.circleName !==undefined)
					$scope.createCircle();
			}
		};

		$scope.clicked = function(){
			$scope.createCircle();
		};

		// Create new Circulo
		$scope.createCircle = function() {
			// Create new Menu object
			var circulo = new Grupoproductos ( { name : $scope.circleName , user: $scope.authentication.user._id } );
			$scope.msgSmartNotification('','Espere un momento...','fa fa-clock-o','#1c86e8', 100);
			circulo.$save(function(response){
				$scope.grupos.push(response);
				$scope.grupo = null;
				$scope.circleName = '';
				if(!$scope.producto){
					$scope.producto={};
					if(!$scope.producto.grupos)
						$scope.producto.grupos =[];
				}
				
				if(!$scope.producto.grupos){
					$scope.producto.grupos=[];
				}
				
				$scope.producto.grupos.push({ name : response.name, id : response._id, checked: true });
				$scope.fillAllGrupos($scope.producto);

				$scope.newCircle = false;
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};

		//END CIRCLE OPTIONS

		//Edit product
		$scope.edit = function(product , index){
			$scope.blockEdit = true;
			$scope.blockNew = false;
			$scope.producto = null;
			$scope.producto = product;
			$scope.fillAllGrupos(product);
			$scope.isdisabled = true;
			$scope.cleanFilesInput();
			$element.find('#content-list').removeClass('col-lg-12').addClass('col-lg-8').next().show('folder');
			if($scope.producto.user === $scope.authentication.user._id)
			{
				$scope.isdisabled = false;
			}
			$scope.indexUser = index;
		};
		// view 2 edit product
		$scope.onEditProduct = function(product){
			$scope.showEditFields = true;
			$scope.newProduct = product;
		};

		//Clean inputs
		$scope.cleanFilesInput = function(){
			angular.forEach( angular.element('input[type="file"]') , function(inputElem) {
		    	angular.element(inputElem).val(null);
		    });
		};

		//Upload process
		$scope.uploadRightAway = true;
		
		$scope.hasUploader = function (index) {
        	return $scope.upload[index] !== null;
    	};
	    
	    $scope.abort = function (index) {
	        $scope.upload[index].abort();
	        $scope.upload[index] = null;
	    };

	    $scope.copyFiles = function($files){
	    	$scope.avatar = $files;
	    	$scope.onFileSelect($scope.avatar);
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
	            if(callback){
	            	if ($scope.uploadRightAway) {
		                $scope.start(j, callback);
		            }	
	            }
	            
	        }
	    };

	    $scope.setPreview = function (fileReader, index) {
	        fileReader.onload = function (e) {
	            $timeout(function () {
	            	$element.find('img[name=img-product]').attr('src', e.target.result);
	            	$element.find('img[name=img-product]').css({'width':'64px','height':'64px'});
	            });
	        };
		};

		 $scope.start = function (index,callback) {
	        $scope.progress[index] = 0;
	        $element.find('div[name=progressBar]').css({'display':'block'});
	        $element.find('div[name=progress]')
	        .css({'width':'0%'})
	        .text('0%')
	        .attr('aria-valuenow',0);
	        $scope.upload[index] = $upload.upload({
	            url: '/products/uploadAvatar',
	            headers: {'myHeaderKey': 'myHeaderVal'},
	            data: {
	                userid : $scope.userid
	            },
	            file: $scope.selectedFiles[index],
	            fileFormDataName: 'myFile'
	        }).then(function ( response ) {
	            angular.forEach($scope.users, function(val,key){
	        		if(val.username === $scope.credentials.username){
	        			val.thumbimage = 'img/placeholders/avatars/avatar1.jpg';
	        			val.thumbimage = response.data[0].thumbimage;
	        		}
	        	});
	            $scope.upload=[];
	            $element.find('div[name=progressBar]').css('display','none');
	            callback();
	        }, null, function (evt) {
	            $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
	            $element.find('div[name=progress]')
	            .text($scope.progress[index] + '%')
	            .attr('aria-valuenow',$scope.progress[index])
	            .css( 'width' , $scope.progress[index] +'%' );
	        });
	    };


	    //Clean array
	    $scope.cleanCredentials = function(){
			$scope.producto = null;
			$scope.fillAllGrupos();
			$scope.blockEdit = false;
			$scope.blockNew = true;		
		};
		//Close content fields
		$scope.onClickCancel = function(){
			$scope.producto = null;
			$scope.fillAllGrupos();
			$scope.blockEdit = false;
			$scope.blockNew = false;
			// if(opt)
			// {				
			// 	$element.find('#contacts-list').removeClass('col-lg-12').addClass('col-lg-8');
			// }	
		};
		//Filter Name
		$scope.searchName = function(letter){
			$scope.letter = letter;
		};

		$scope.changeOption = function(option,text){
			$scope.findMeBy = option;
			$scope.findMeByText = text;
		};

		//Update while clicked
		$scope.updateGroupsArray = function(){
			if(!$scope.producto){
				$scope.producto= {};
			}
			
			$scope.producto.grupos = [];

			angular.forEach($scope.grupos, function(grupo){
				if(grupo.checked){
					$scope.producto.grupos.push({id : grupo._id, name: grupo.name, checked: grupo.checked });
				}
			});
		};

		//filter change
		$scope.changeOption = function(option,text){
			$scope.field = option;
			$scope.findMeByText = text;
		};

		//Search document
		$scope.lookForDocument = function(e){
			if(e.keyCode === 13){
				var doc = {name_document : $scope.newProduct.name_document};
				$http.post('/documentos/listByDocument',doc).success(function(response){
					if(response.length>0){
						$scope.showStatusValidateDocument = true;
						$scope.displayedCollection = [];
						$scope.productsCopy=[];
						
						var r=[];
						angular.copy(response[0].items,r);
						angular.forEach(r, function(copy){
							var finded = 0;
							angular.forEach(response[0].items,function(items, index){
								if(copy.descripcion === items.descripcion){
									finded ++;
								}
								if(finded>1){
									response[0].items.splice(index,1);
									finded --;
								}
							});
						});

						$scope.products = response[0].items;
						angular.copy($scope.originalProducts, $scope.productsCopy);
						$scope.validationDocumentoProduct(response);
					}else{
					$scope.msgSmartNotification('Documento' , 'Documento no encontrado' , 'fa fa-frown-o' , '#C46A69' );	
					}
				}).error(function(errorResponse){
					$scope.error = errorResponse.message;
					$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
				});
			}
		};

		//Start validation process
		//CACE361963
		$scope.validationDocumentoProduct = function(response){
			$scope.products = [];
			console.log(response);
			angular.forEach(response[0].items, function(items){
				var finded =false;
				var theProduct = { descripcion: items.descripcion, precio_compra:[{ precio: items.precio, id_proveedor : response[0].contacto[0] }], exist : false, name_document : $scope.newProduct.name_document, selected : false,  };
				
				if($scope.productsCopy.length>0){
					angular.forEach($scope.productsCopy, function(products){
						if(!finded){
							if(items.descripcion === products.name ){
								theProduct.exist = true;
								finded = true;
							}else if(items.descripcion === products.descripcion){
								theProduct.exist = true;
								finded = true;
							}else{
								theProduct.exist = false;
							}
							if(finded)							
								$scope.products.push(theProduct);
						}						
					});
				}else{
					$scope.products.push(theProduct);
				}

				if($scope.products.length <1 && !finded){
					$scope.products.push(theProduct);
				}
			});
			$scope.displayedCollection =[].concat($scope.products);
		};

		//When we want all new checked
		$scope.onAllInputCheck = function(){
			angular.forEach($scope.products, function(newProduct){
				if(!newProduct.exist)
					newProduct.selected = $scope.allCheck;
			});
		};

		$scope.onCheckClick = function(product){
			if(product.exist)
			{
				$timeout(function(){
					product.selected = false;
				});
			}		
		};

		//Save all the products from document
		$scope.onSaveSelected = function(){

			var indexes =[];
			var num =0;
			angular.forEach($scope.products, function(product,index){
				product.name_document = $scope.newProduct.name_document;
				if(product.exist)
					indexes.push(product.descripcion);
				if(product.selected)
					num++;

			});
			if(num>0){
				angular.forEach(indexes, function(index){
					angular.forEach($scope.products, function(product, i){
						if(index === product.descripcion){
							$scope.products.splice(i,1);
						}
					});
				});
				$scope.msgSmartNotification('','Espere un momento...','fa fa-clock-o','#1c86e8', 100);
				$http.post('/products/insertMassive',$scope.products).success(function(response){
					$scope.msgSmartNotification('Productos','Productos agregados correctamente','fa fa-check','#739E73');
					$scope.displayedCollection =[];
					$scope.showStatusValidateDocument = false;
					$scope.newProduct.name_document='';
					$scope.find();
				}).error(function(errorResponse){
					$scope.error = errorResponse.message;
					$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
				});
			}else{
				$scope.msgSmartNotification('Productos','Seleccione algunos productos','','#e20303');	
			}
		};

		$scope.onAllStatusChange= function(){
			$scope.AlertNotificationCenterForGuests('¿Cambiar estatus?','¿Estas seguro de cambiar el estatus?','onClickNo()-onClickYes()','[No cambiar][Cambiar]',1);
		};

		$scope.onClickNo = function(){
			$scope.statusSelected = undefined;
		};

		$scope.onClickYes = function(){
			//statusSelected
			var patt = new RegExp($scope.lookFor,'i');
			var array=[];
			angular.forEach($scope.products, function(product){
				if((patt.test(product.name_document)) || (patt.test(product.name)) || (patt.test(product.descripcion))){
					product.status = $scope.statusSelected;
					array.push(product);
				}
			});
			$scope.msgSmartNotification('','Espere un momento...','fa fa-clock-o','#1c86e8', 100);
			$http.post('/products/updateMassive',array).success(function(response){
				$scope.msgSmartNotification('Productos','Productos actualizado correctamente','fa fa-check','#739E73');
				$scope.showStatusValidateDocument = false;
				$scope.statusSelected=undefined;
			}).error(function(errorResponse){
				$scope.error = errorResponse.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		//We do not want to import products document
		$scope.onCancelDocument = function(){
			$scope.displayedCollection =[];
			$scope.showStatusValidateDocument = false;
			$scope.newProduct.name_document='';
			$scope.find();
		};

		//TipoCuentas
		$scope.addTag = function() {	
			var ok=true;
			if($scope.tagTextSerie){
				if ( $scope.tagTextSerie.length < 1 ) {
					return;
				}else{
					$scope.tagTextSerie = $scope.tagTextSerie.toUpperCase();
					angular.forEach($scope.product.no_series, function(value,key){
						value.name = value.name.toUpperCase();
						if(value.name === $scope.tagTextSerie)
						{
							ok=false;
						}
					});
				}
			}else{
				return;
			}
			if(ok){
				$scope.product.no_series.push({ name : $scope.tagTextSerie });
				$scope.tagTextSerie = '';	
			}
		};

		$scope.deleteTag = function(key, tag) {
			var response;
			if($scope.tagTextSerie==='')
				$scope.tagTextSerie = undefined;
			if ($scope.product.no_series.length > 0 && $scope.tagTextSerie === undefined && key === undefined) {
				tag = $scope.product.no_series[$scope.product.no_series.length-1];
				tag = tag.name;
				$scope.product.no_series.pop();			
			}

			if(tag){
				angular.forEach($scope.cuentas, function(tipo, keytipo){
					if( tipo.name === tag ){
						response = tipo;
					}
				});
			}
		};


		//New Sell price
		$scope.onEnterNewSell = function(event){
			if( event.keyCode === 27 ){
				$scope.showPriceSell=false;
				$scope.newSellPrice = undefined;
			}else if(event.keyCode === 13){
				var finded = false;
				angular.forEach($scope.product.precio_compra,function(precios){
					if(precios.precio+'' === $scope.newSellPrice){
						finded = true;
					}
				});

				if(!finded){
					$scope.product.precio_compra.push( { precio : Number($scope.newSellPrice) } );
					$scope.update($scope.product);
					$scope.precio_compra= undefined;
					$scope.prov_compra= undefined;					
					$scope.showPriceSell=false;
					$scope.newSellPrice = undefined;
				}else{
					$scope.msgSmartNotification('Error precio duplicado' , 'El precio ya existe' , 'fa fa-frown-o' , '#C46A69' );
				}
			}
		};

		//On change select
		$scope.onSellPriceChange = function(){
			if($scope.precio_compra){
				if(!$scope.inputTagContactos)
					$scope.fillContacts();
				angular.forEach($scope.product.precio_compra, function(precios){
					if(precios._id){
						if(precios._id === $scope.precio_compra){
							if(precios.id_proveedor)
								$scope.prov_compra = precios.id_proveedor._id;
							else
								$scope.prov_compra = undefined;
						}
					}
				});		
			}			
		};
		//On delete one price
		$scope.deletePriceSell = function(){
			angular.forEach($scope.product.precio_compra, function(sell_price,index){
				if(sell_price._id === $scope.precio_compra){
					$scope.product.precio_compra.splice(index,1);
					$scope.inputTagContactos = undefined;
					$scope.precio_compra= undefined;
					$scope.prov_compra= undefined;
				}
			});
			$scope.update($scope.product);
		};

		//On sell provider change
		$scope.onProvSellChange = function(){
			angular.forEach($scope.product.precio_compra, function(sell_price){
				if(sell_price._id === $scope.precio_compra){
					sell_price.id_proveedor = $scope.prov_compra;
				}
			});
		};


		//New Sell price
		$scope.onEnterNewPurch = function(event){
			if( event.keyCode === 27 ){
				$scope.showPurchPrice=false;
				$scope.newPurchPrice = undefined;
			}else if(event.keyCode === 13){
				var finded = false;
				angular.forEach($scope.product.precio_venta,function(precios){
					if(precios.precio+'' === $scope.newPurchPrice){
						finded = true;
					}
				});

				if(!finded){
					$scope.product.precio_venta.push( { precio : Number($scope.newPurchPrice) } );
					$scope.update($scope.product);
					$scope.precio_venta = undefined;
					$scope.prov_venta= undefined;					
					$scope.showPurchPrice=false;
					$scope.newPurchPrice = undefined;
				}else{
					$scope.msgSmartNotification('Error precio duplicado' , 'El precio ya existe' , 'fa fa-frown-o' , '#C46A69' );
				}
			}
		};

		//On change select
		$scope.onPurchPriceChange = function(){
			if($scope.precio_venta){
				if(!$scope.inputTagContactos2)
					$scope.fillContacts2();
				angular.forEach($scope.product.precio_venta, function(precios){
					if(precios._id){
						if(precios._id === $scope.precio_venta){
							if(precios.proveedor){
								if(precios.proveedor.length>0){
									$scope.prov_venta = [];	
									angular.forEach(precios.proveedor, function(proveedor){
										$scope.prov_venta.push(proveedor.id_proveedor._id);
									});
								}
							}else
								$scope.prov_venta = undefined;
						}
					}
				});		
			}			
		};
		//On delete one price
		$scope.deletePricePurch = function(){
			angular.forEach($scope.product.precio_venta, function(purch_price,index){
				if(purch_price._id === $scope.precio_venta){
					$scope.product.precio_venta.splice(index,1);
					$scope.inputTagContactos2 = undefined;
					$scope.precio_venta= undefined;
					$scope.prov_venta= undefined;
				}
			});
			$scope.update($scope.product);
		};

		//On purch provider change
		$scope.onProvPurchChange = function(){
			angular.forEach($scope.product.precio_venta, function(purch_price){
				if(purch_price._id === $scope.precio_venta){
					purch_price.proveedor = [];
					angular.forEach($scope.prov_venta, function(proveedor){
						purch_price.proveedor.push({id_proveedor:proveedor}); 
					});
				}
			});
		};
	}
]);