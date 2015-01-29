'use strict';
/*
Errores por resolver
birthday picker: Al volver ingresar borra la fecha y no coloca la del contacto
*/
// Contactos controller
angular.module('contactos').controller('ContactosController', ['$scope', '$http' , '$stateParams', '$location' , '$element' , '$timeout', 'Authentication', 'Contactos', 'CodPostals' ,'Circulos', 'Historials' , '$upload',
	function($scope , $http , $stateParams, $location, $element ,  $timeout , Authentication, Contactos, CodPostals, Circulos, Historials ,  $upload ) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;	
		$scope.colonias = [];
		$scope.tagTextProject = '';
		$scope.isdisabled = false;
		$scope.findMeBy = 'razonSocial';
		$scope.findMeByText = 'Por Razón Social';
		$scope.textFindMe = '';
		$scope.blockEdit = false;
		$scope.blockNew = false;
		//
		$scope.tipocontact ={ 
			'Proveedor' : 'Proveedor',
			'Cliente' : 'Cliente',
			'Prospecto' : 'Prospecto',
			'Otro tipo' : 'Otro tipo'
		};

		// Create new Contacto
		$scope.create = function() {
			// Create new Contacto object
			$scope.credentials.colonia = [];	
			$scope.credentials.colonia.push($scope.coloniaSelected);
			
			var contacto = new Contactos ( $scope.credentials );

			// Redirect after save
			contacto.$save(function(response) {
				$scope.userid = response._id;
				if($scope.avatar){
					$scope.onFileSelect($scope.avatar, function(){
						$scope.msgSmartNotification('Contactos','Se guardo correctamente','fa fa-check','#739E73');
						$scope.contactos.push(response);
			            $scope.isOk = true;	
						$timeout(function () {
		                	$scope.isOk = undefined;
		            	},1000);
		            	$scope.credentials = [];						
					});
				}else{
					$scope.msgSmartNotification('Contactos','Se guardo correctamente','fa fa-check','#739E73');
					$scope.contactos.push(response);
		            $scope.isOk = true;	
					$timeout(function () {
	                	$scope.isOk = undefined;
	            	},1000);
				}

				$scope.createHistorial(response, 'Contacto agregado', 'gi gi-user_add', 'contactos');
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error','No se guardo correctamente: '+ $scope.error,'fa fa-frown-o','#C46A69');
	            $scope.isOk = false;	
				$timeout(function () {
                	$scope.isOk = undefined;
            	},1000);
			});
		};

		// Remove existing Contacto
		$scope.remove = function( contacto ) {
			if ( contacto ) { 
				contacto.$remove();
				for (var i in $scope.contactos ) {
					if ($scope.contactos [i] === contacto ) {
						$scope.contactos.splice(i, 1);
					}
				}
			} else {
				$scope.contacto.$remove(function() {
					$location.path('contactos');
				});
			}
		};

		// Update existing Contacto
		$scope.update = function() {
			$scope.credentials.colonia = [];	
			$scope.credentials.colonia.push($scope.coloniaSelected);
			var contacto = $scope.credentials ;
			contacto.$update(function(response) {
				$scope.createHistorial(response, 'Contacto actualizado', 'gi gi-user_add', 'contactos');
				$scope.userid = response._id;
				if($scope.avatar){
					$scope.onFileSelect($scope.avatar, function(){
						$scope.msgSmartNotification('Contactos','Se guardo correctamente','fa fa-check','#739E73');
			            $scope.isUpdated = true;	
						$timeout(function () {
		                	$scope.isUpdated = undefined;
		            	},1000);					
					});
				}else{
					$scope.msgSmartNotification('Contactos','Se guardo correctamente','fa fa-check','#739E73');
		            $scope.isUpdated = true;	
					$timeout(function () {
	                	$scope.isUpdated = undefined;
	            	},1000);
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error','No se guardo correctamente: '+ $scope.error,'fa fa-frown-o','#C46A69');
	            $scope.isUpdated = false;	
				$timeout(function () {
                	$scope.isUpdated = undefined;
            	},1000);
			});
		};

		$scope.edit = function(contacto , index){
			$scope.blockEdit = true;
			$scope.blockNew = false;
			$scope.credentials = null;
			$scope.credentials = contacto;
			$scope.updateCircles(contacto);
			$scope.inputTags = $scope.credentials.functions;
			$scope.inputProjects = $scope.credentials.projects;
			$scope.isdisabled = true;
			$scope.cleanFilesInput();
			if($scope.credentials.user === $scope.authentication.user._id)
			{
				$scope.isdisabled = false;
			}
			$scope.indexUser = index;
			$scope.colonias = [];
			var selected;
			$http.post('/cod-postals/findByCP', $scope.credentials).success(function(response){
				angular.forEach(response , function(value , key){
					if(value.d_asenta === contacto.colonia[0].name){
						selected = key;
					}
					$scope.colonias.push({ name : value.d_asenta});
				});
				$scope.coloniaSelected = $scope.colonias[selected];
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		// Find a list of Contactos
		$scope.find = function() {
			Contactos.query(function(response){
				$scope.contactos = response;
				var index=0;
				if($scope.authentication.user.roles[0] !== 'admin'){
					angular.forEach(response, function(contact){
					if(contact.isprivate){
						if(contact.user !== $scope.authentication.user._id){
							$scope.contactos.splice(index,1);
						}
					}
					index++;
				});	
				}				
			});
			
			if($stateParams.contactoId){
				$scope.findOne();
				$element.find('#block-update-contact').css('display','block');
				$element.find('#contacts-list').removeClass('col-lg-12').addClass('col-lg-8');
			}
		};

		$scope.updateCircles = function(response){
			Circulos.query(function(circulos){
				$scope.circulos= [];
				angular.forEach(circulos,function(circulo){
					$scope.circulos.push({ name : circulo.name, _id : circulo._id, checked : false });
				});
				var contTrue = 0;
				var title = '';
				if(response){
					angular.forEach(response.circles, function(doc){
						angular.forEach($scope.circulos, function(value){
							if(value._id+'' === doc.idcircle+''){
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
				$scope.circulos.total = contTrue;
				$scope.circulos.title = title;
			});
		};

		$scope.findCp = function(){
			var selected;
			if($scope.credentials.cp.length === 5){
				$scope.colonias=[];
				$http.post('/cod-postals/findByCP', $scope.credentials).success(function(response){
					angular.forEach(response , function(value , key){
						$scope.colonias.push({ name : value.d_asenta});
					});
					$scope.coloniaSelected = $scope.colonias[0];
					$scope.credentials.estado = response[0].d_estado;
					$scope.credentials.ciudad = response[0].d_ciudad;
				}).error(function(response){
					$scope.error = response.message;
				});
			}
		};


		// Find existing Contacto
		$scope.findOne = function() {
			$scope.credentials = Contactos.get({ 
				contactoId: $stateParams.contactoId
			});
		};

		$scope.newAddTelephone = function(){
			var isNew = false;
			$scope.error ='';
			if($scope.credentials){
				if(!$scope.credentials.telephons)
				{
					$scope.credentials.telephons=[];
					$scope.credentials.telephons.push( { telephone:'' } );
					isNew = true;
				}
				var last = $scope.credentials.telephons.length-1;
				if(!isNew){
					if($scope.credentials.telephons[last] === '')
					{
						$scope.error = 'Digite su número de telefono';
					}else{
						$scope.error = '';
						$scope.credentials.telephons.push({ telephone : '' });
					}
				}
			}else
			{
				$scope.error ='Es necesario llenar los campos anteriores';
			}		
		};

		$scope.functionsChange = function(){
			console.log($scope.credentials);
		};

		$scope.deleteAddTelephoneContact = function(index){
			$scope.credentials.telephons.splice(index, 1);
		};

		$scope.newAddRFC = function(){
			var isNew = false;
			$scope.error ='';
			if($scope.credentials){
				if(!$scope.credentials.rfcs)
				{
					$scope.credentials.rfcs=[];
					$scope.credentials.rfcs.push( { rfc:'' } );
					isNew = true;
				}
				var last = $scope.credentials.rfcs.length-1;
				if(!isNew){
					if($scope.credentials.rfcs[last] === '')
					{
						$scope.error = 'Digite su número de RFC';
					}else{
						$scope.error = '';
						$scope.credentials.rfcs.push({ rfc : '' });
					}
				}
			}else
			{
				$scope.error ='Es necesario llenar los campos anteriores';
			}
		};

		$scope.deleteAddRFCSContact = function(index){
			$scope.credentials.rfcs.splice(index, 1);
		};

		$scope.inputTags = [];

		$scope.addTag = function() {			
			if ($scope.tagText.length === 0) {
				return;
			}
			$scope.inputTags.push({name: $scope.tagText});
			$scope.tagText = '';
			$scope.credentials.functions = $scope.inputTags;
		};

		$scope.deleteTag = function(key) {
			if ($scope.inputTags.length > 0 &&
				$scope.tagText.length === 0 &&
				key === undefined) {
				$scope.inputTags.pop();
			} else if (key !== undefined) {
				$scope.inputTags.splice(key, 1);
			}
			$scope.credentials.functions = $scope.inputTags;
		};

		$scope.inputProjects = [];
		$scope.addTagProject = function() {	
			
			if ($scope.tagTextProject.length === 0) {
				return;
			}
			$scope.inputProjects.push({ name : $scope.tagTextProject });
			$scope.tagTextProject = '';
			$scope.credentials.projects = $scope.inputProjects;
		};

		$scope.deleteTagProject = function(key) {
			console.log($scope.tagTextProject);
			if ($scope.inputProjects.length > 0 && $scope.tagTextProject.length === 0 && key === undefined) {
				$scope.inputProjects.pop();
			} else if (key !== undefined) {
				$scope.inputProjects.splice(key, 1);
			}
			$scope.credentials.projects = $scope.inputProjects;
		};

		$scope.cleanCredentials = function(opt){
			$scope.credentials = null;
			$scope.updateCircles();
			$scope.colonias = null;
			$scope.inputProjects = [];
			$scope.inputTags = [];
			$scope.blockEdit = false;
			$scope.blockNew = false;
			if(opt)
			{				
				$element.find('#contacts-list').removeClass('col-lg-12').addClass('col-lg-8');
			}
			//else{
				//$element.find('#contacts-list').removeClass('col-lg-8').addClass('col-lg-12');
			//}
			
		};

		$scope.searchName = function(letter){
			$scope.letter = letter;
		};

		$scope.changeOption = function(option,text){
			$scope.findMeBy = option;
			$scope.findMeByText = text;
		};

		$scope.startFinding = function(){
			var param;
			
			switch($scope.findMeBy){
				case 'razonSocial' : param = { name : 'razonSocial', value : $scope.textFindMe }; break;
				case 'projects.name' : param = { name : 'projects.name', value : $scope.textFindMe }; break;
				case 'comercialName' : param = { name : 'comercialName', value : $scope.textFindMe }; break;
				case 'tipocontacto' : param = { name : 'tipocontacto', value : $scope.textFindMe }; break;
			}

			if( $scope.textFindMe !== '' ){
				$http.post('/contactos/listByParam', param).success(function(response){
					$scope.contactos = [];
					$scope.contactos = response;
					$scope.textFindMe ='';
				}).error(function(response){
					$scope.error = response.message;
				});	
			}

			if($scope.findMeBy === 'all'){
				$scope.find();
			}			
		};

		$scope.onKeyFindMe = function(myevent){
			if(myevent.keyCode===13){
				$scope.startFinding();
			}
		};

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
	                $scope.start(j, callback);
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

	    $scope.start = function (index,callback) {
	        $scope.progress[index] = 0;
	        $element.find('div[name=progressBar]').css({'display':'block'});
	        $element.find('div[name=progress]')
	        .css({'width':'0%'})
	        .text('0%')
	        .attr('aria-valuenow',0);
	        $scope.upload[index] = $upload.upload({
	            url: '/contactos/uploadAvatar',
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

	    $scope.msgSmartNotification = function( title,  content, icon, color){
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;
		};

		$scope.cleanFilesInput = function(){
			angular.forEach( angular.element('input[type="file"]') , function(inputElem) {
		    	angular.element(inputElem).val(null);
		    });
		};

		$scope.updateCountries = function(){
			$http.get('http://localhost:3000/scriptCountries.json').success(function ( response ) {
				// body...
				console.log(response);
			}).error(function(errorResponse){
				console.log(errorResponse.message);
			});
		};

		$scope.deleteContact = function(contacto,index){
			$http.post('/contactos/deletecontacto',contacto).success(function ( response ) {
				// body...
				if(response === '1'){
					$scope.msgSmartNotification('Contactos','Se eliminó correctamente','fa fa-check','#739E73');
						$scope.contactos.splice(index,1);
			            $scope.isOk = true;	
						$timeout(function () {
		                	$scope.isOk = undefined;
		            	},1000);
				}
					
			}).error(function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error','No se eliminó correctamente: '+ $scope.error,'fa fa-frown-o','#C46A69');
	            $scope.isOk = false;	
				$timeout(function () {
                	$scope.isOk = undefined;
            	},1000);
			});

		};

		//CIRCLES OPTIONS
		$scope.onClickLi = function(index, newCircle, circle){
			$timeout(function(){
				$element.find('div[name="c-options"]').addClass('open');	
			});

			if(newCircle === 0){
				$scope.newCircle = false;
				if(circle.checked)
					circle.checked = false;
				else 
					circle.checked = true;

					$scope.updateCirclesDocument();
					//$scope.update();
				
			}else if(newCircle === 1){
				$scope.newCircle = true;
				$timeout(function(){
					$element.find('input[name="newCircleInput"]').focus();
				});
			}
		};

		$scope.onKeyPressNewCircle = function(e){
			if(e.keyCode === 27){
				$scope.newCircle = false;
				$scope.credentials.circleName = '';
			}else if(e.keyCode === 13){
				if($scope.credentials.circleName !== '' || $scope.credentials.circleName !==undefined)
					$scope.createCircle();
			}
		};

		$scope.clicked = function(){
			$scope.createCircle();
		};

		// Create new Circulo
		$scope.createCircle = function() {
			// Create new Menu object
			var circulo = new Circulos ( { name : $scope.credentials.circleName , user: $scope.authentication.user._id } );
			circulo.$save(function(response){
				$scope.circulos.push(response);
				$scope.circulo = null;
				$scope.credentials.circleName = '';
				$scope.credentials.circles.push({ name : response.name, idcircle: response._id, checked: true });
				$scope.newCircle = false;
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};

		$scope.updateCirclesDocument = function(){
			if(!$scope.credentials)
				$scope.credentials = {};
			$scope.credentials.circles = [];
			angular.forEach($scope.circulos, function(circle){
				if( circle.checked ){
					$scope.credentials.circles.push( { idcircle : circle._id, name: circle.name, checked: circle.checked } );
				}
			});
		};

		/*Historials*/
		// Create new Historial
		$scope.createHistorial = function(response, typemov, icon, url ) {
			// Create new Historial object
			var historial = new Historials ({
				typemov : typemov,
				contacto : {},
				icon : icon,
				url : url,
				user: $scope.user._id,
				from : 'Contactos'
			});
			// Redirect after save
			historial.contacto = response;
			historial.$save(function(response) {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};
	}
]);