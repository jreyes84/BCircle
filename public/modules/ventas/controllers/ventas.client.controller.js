'use strict';

// Ventas controller
angular.module('ventas').controller('VentasController', ['$scope', '$stateParams', '$location', '$http', '$timeout' , 'Authentication', 'Ventas' , 'Grupoproductos' ,'Products', 'Configsystems','TemplateMovimientos', 'Documentos',
	function($scope, $stateParams, $location, $http, $timeout, Authentication, Ventas , Grupoproductos, Products, Configsystems, TemplateMovimientos, Documentos) {
		$scope.authentication = Authentication;
		$scope.filterBy = 'name';
		$scope.findMeByText='Producto';
		$scope.textFilter ='';
		$scope.calcNumber = '0';
		$scope.showActions = false;
		$scope.cart = [];
		$scope.total = 24;
		$scope.clearInput = false;
		$scope.productLastSelected=undefined;
		$scope.promotions =[];
		$scope.listCuentasFromTemplates=[];
		$scope.documento = {};
		$scope.inputTagTemplate = [];
		$scope.configSystem ={};
		$scope.configButton = false;
		$scope.configSelect = false;

		if($scope.authentication.user.roles[0] === 'admin'){
			$scope.configButton = true;
		}

		$scope.calculadora = [
			{ text: '1', value : '1', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '2', value : '2', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '3', value : '3', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '4', value : '4', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '5', value : '5', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '6', value : '6', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '7', value : '7', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '8', value : '8', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '9', value : '9', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: 'C', value : 'C', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: '0', value : '0', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: 'Ent', value : 'Ent', dataclass:'col-xs-4 col-md-4 col-lg-4' },
			{ text: 'Cancelar todo', value : 'reset', dataclass:'col-xs-12 col-md-12 col-lg-12' }
		];
		// Create new Venta
		$scope.create = function(callback) {
			// Create new Venta object
			var venta = new Ventas ($scope.cart);

			// Redirect after save
			venta.$save(function(response) {
				$scope.msgSmartNotification('Venta','Venta agregada correctamente','fa fa-check','#739E73');
				$scope.cart = [];
				$scope.productLastSelected = undefined;
				if(callback)
					callback();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};

		// Remove existing Venta
		$scope.remove = function( venta ) {
			if ( venta ) { venta.$remove();

				for (var i in $scope.ventas ) {
					if ($scope.ventas [i] === venta ) {
						$scope.ventas.splice(i, 1);
					}
				}
			} else {
				$scope.venta.$remove(function() {
					$location.path('ventas');
				});
			}
		};

		// Update existing Venta
		$scope.update = function() {
			var venta = $scope.venta ;

			venta.$update(function() {
				$location.path('ventas/' + venta._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ventas
		$scope.find = function() {
			$scope.ventas = Ventas.query();
			Products.query(function(products){
				$scope.products = [];

				angular.forEach(products, function(product){	
					var finded = false;
					if(!product.precio_venta){
						finded = true;
					}else if(product.precio_venta < 1){
						finded = true;
					}
					if(!finded)
						$scope.products.push(product);
				});

				Grupoproductos.query(function(grupos){
					$scope.grupos = grupos;
					angular.forEach($scope.products, function(product){
						angular.forEach($scope.grupos, function(grupo){
							if(!grupo.total)
								grupo.total = 0;
							angular.forEach(product.grupos, function(array){
								if(array.id+'' === grupo._id+''){
									grupo.total++;
								}
							});
						});
					});
					$http.post('/promotionById').success(function(promotionResult){
						$scope.promotions = promotionResult;
					}).error(function(resultError){

					});
					TemplateMovimientos.query(function(templates){
						angular.forEach(templates, function(template){
							$scope.inputTagTemplate.push({id:template._id, text: template.name});
						});
					});
					$scope.puntoVentaTemplate =[];
					Configsystems.query(function(config){
						angular.forEach(config, function(conf){
							angular.forEach(conf.puntoVentaTemplate,function(templates){
								$scope.puntoVentaTemplate.push(templates.id_template);
							});							
						});
						$http.post('/template-movimientos/listCuentasFromTemplates',$scope.puntoVentaTemplate).success(function(response){
							if(!$scope.documento.cuentas)
								$scope.documento.cuentas = [];
							$scope.documento.cuentas = response;
							console.log($scope.documento);
							//$scope.listCuentasFromTemplates = response;
						}).error(function(errorResponse){
							$scope.error = errorResponse.data.message;
						});
					});
				});
			});
		};

		// Find existing Venta
		$scope.findOne = function() {
			$scope.venta = Ventas.get({ 
				ventaId: $stateParams.ventaId
			});
		};

		//on group change
		$scope.onGroupChange = function(grupo){
			$scope.textFilter = grupo;
		};

		//on changeOption
		$scope.changeOption = function(field, text){
			$scope.filterBy = field;
			$scope.textFilter = text;
		};
		//on click Calc number
		$scope.onClickCalcNumber = function(value){
			if($scope.clearInput){ // if Changed was pressed, 
				$scope.calcNumber = '';
				$scope.clearInput = false;
			}

			if(value === 'C'){
				$scope.calcNumber='0';
				$scope.productLastSelected = undefined;
			}else if(value === 'reset'){
				$scope.cart =[];
				$scope.calcNumber = '0';
				$scope.productLastSelected = undefined;
				angular.forEach($scope.products, function(product){
					delete product.cantidad;
					delete product.subtotal;
				});
			}else if($scope.calcNumber === '0' || $scope.calcNumber ==='C')
				 $scope.calcNumber=value;
			else if(value === 'Ent'){
				$scope.cart.total = 0;

				if($scope.productLastSelected.cantidad){
					$scope.productLastSelected.cantidad = parseInt($scope.calcNumber)-1;
					$scope.productLastSelected.subtotal = $scope.productLastSelected.cantidad * $scope.productLastSelected.precio_venta;
					$scope.updateCartTotal($scope.productLastSelected);
				}				
				$scope.calcNumber='0';
				$scope.productLastSelected = undefined;
			}else{
				$scope.calcNumber += value;
			}
		};

		//When product was pess for 1 sencond
		$scope.onLongClick = function(){
			if(!$scope.showActions)
				$scope.showActions = true;
			else
				$scope.showActions = false;
		};

		//Insert product to the cart
		$scope.onClickProduct = function(product){
			var promotionForzed;
			angular.forEach($scope.promotions, function(promotion){
				angular.forEach(promotion.combo, function(combo){
					if(promotion.forzada){
						if(combo.id._id === product._id){
							promotionForzed = promotion;
						}
					}					
				});
			});

			if(promotionForzed){
				$scope.onPromoClick(promotionForzed);
			}else{
				$scope.withOutPromo(product);
				$scope.updateTotal();
			}							
		};

		//When prices change we update de total of cart
		$scope.updateCartTotal = function(product,promotion){
			var finded = false;
			
			angular.forEach($scope.cart.productos, function(cart){
				if(cart._id === product._id){
					finded = true;
					if(!cart.cantidad)
						cart.cantidad = 0;
					if(!product.cantidad)
						product.cantidad = 1;
					if(promotion)
						if(!product.id_promocion)
							product.id_promocion = promotion._id;
					cart.cantidad += Number(product.cantidad);
					cart.subtotal = Number(product.precio_venta * cart.cantidad);
					if(promotion){
						if(product.id_promocion)
							cart.subtotal = Number((cart.subtotal * (promotion.descuento / 100)).toFixed(2));
					}
						
				}
			});
			return finded;
		};

		//On delete product 
		$scope.onDeleteProduct = function(index, product){
			//Note, I need to complete this funcction, allowing to eliminate multiple at the same time as promotions need it.
			var deleted = false;
			var deleteIndex = [];
			angular.forEach($scope.cart.productos, function(cartProducts, cartIndex){
				if(product._id === cartProducts._id && !deleted){
					if(cartProducts.id_promocion){
						deleted = false;
						deleteIndex.push({id_promocion : cartProducts.id_promocion});
					}else{
						deleted = true;
						deleteIndex.push(cartProducts._id);
					}
						
				}
			});
			angular.forEach(deleteIndex, function(id){
				if(id.id_promocion){
					var products;
					angular.forEach($scope.cart.productos, function(product, index){
						if(product.id_promocion === id.id_promocion){
							$scope.cart.productos.splice(index,1);
						}
					});				
					$scope.cart.productos.splice();
				}else{
					angular.forEach($scope.cart.productos, function(product, index){
						if(product._id === id)
							$scope.cart.productos.splice(index,1);		
					});				
				}
			});

			$scope.updateTotal();
			
		};

		//On Click promotion 
		$scope.onPromoClick = function(promotion){
			var finded = false;
			if(!$scope.cart.total)
				$scope.cart.total = 0;
			if(!$scope.cart.productos)
				$scope.cart.productos = [];

			angular.forEach(promotion.combo,function(combo){
				var product={};
				angular.copy(combo.id, product);
				
				if(!product.cantidad){
					product.cantidad = 1;
					product.id_promocion = promotion._id;
					product.subtotal = (( product.precio_venta * product.cantidad ) * ( promotion.descuento / 100)).toFixed(2);
				}

				finded = $scope.updateCartTotal(product,promotion);
				
				if(!finded)
					$scope.cart.productos.push(product);

			});
			$scope.updateTotal();
		};
		//product without promotion
		$scope.withOutPromo = function(product){
			var finded = false;
			var newProduct={};
			angular.copy(product,newProduct);
			$scope.productLastSelected = product;
			if(!newProduct.cantidad){
				newProduct.cantidad = 1;
				newProduct.subtotal = newProduct.precio_venta * newProduct.cantidad;
			}

			finded = $scope.updateCartTotal(newProduct);
			
			if(!finded){
				if(!$scope.cart.productos)
					$scope.cart.productos =[];
				
				$scope.cart.productos.push(newProduct);
			}
		};

		//Sum cart total
		$scope.updateTotal = function(){
			$scope.cart.total = 0;
			angular.forEach($scope.cart.productos, function(cart){
				$scope.cart.total += Number(cart.subtotal);
			});
		};

		$scope.purchaseCart = function(){
			if($scope.cart && $scope.cart.productos && $scope.cart.productos.length>0){
				if($scope.calcNumber !== '0')
					$scope.calcNumber = (parseInt($scope.calcNumber) - $scope.cart.total)+'';

				if(parseInt($scope.calcNumber)>=0){
					$scope.clearInput = true;
					//first insert to cart
					$scope.create();
				}else{
					$scope.msgSmartNotification('Venta','Valor no correcto, verifique la cantidad a cambiar.','fa fa-money','#e20303');	
					$scope.calcNumber = '0';
				}
			}else{
				$scope.msgSmartNotification('Venta','No has agregado ningun producto a tu venta','fa fa-money','#e20303');
			}
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

		//On change tag
		$scope.onTagChange = function(){
			$scope.configSystem.puntoVentaTemplate = [];
			angular.forEach($scope.puntoVentaTemplate, function(template){
				$scope.configSystem.puntoVentaTemplate.push({id_template : template});
			});

			Configsystems.query(function(config){
				var conf;
				if(config.length>0){
					//update
					$scope.configSystem._id = config[0]._id;
					conf = new Configsystems ($scope.configSystem);
					// Redirect after save
					conf.$update(function(response) {
						console.log('');
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
						$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
					});
				}else{
					//create
					conf = new Configsystems ($scope.configSystem);
					// Redirect after save
					conf.$save(function(response) {
						console.log('');
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
						$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
					});
				}
			});
		};

		//Click config
		$scope.onClickConfig = function(){
			if($scope.configSelect)
				$scope.configSelect = false;
			else
				$scope.configSelect = true;
		};

		$scope.cargos_abonos = function(){
			//Hacer los cargos
			angular.forEach( $scope.documento.cuentas , function( value ){
				value.cargoQty = 0;
				value.abonoQty = 0;
			});

			angular.forEach( $scope.documento.cuentas, function( value , key ){
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


	}
]);