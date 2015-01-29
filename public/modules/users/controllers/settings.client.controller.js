'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http' , '$location' , '$element' , '$timeout' , 'Socket', 'Users', 'Authentication','Menus', 'Circulos' , '$upload', 'Historials',
	function($scope, $http, $location , $element , $timeout , Socket , Users, Authentication, Menus, Circulos , $upload, Historials) {
		$scope.user = Authentication.user;	
		/*Socket.on('menu.assigned', function(user){
			console.log(user);
			$scope.groups = user.groups;
		});	*/
		/*
		gi gi-user_add
		gi gi-user_remove
		*/
		$scope.groups = {};
		
		$scope.roles = {
			admin: 'Dios',
			user : 'Humano',
			other : 'Goku'
		};

		$scope.workDays = 
		{
			lunes : 'Lunes' ,
			martes : 'Martes', 
			miercoles : 'Miércoles' , 
			jueves : 'Jueves', 
			viernes : 'Viernes' , 
			sabado: 'Sábado'  , 
			domingo : 'Domingo'
		};

		// If user is not signed in then redirect back home
		if (!$scope.user) 
			$location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}
			return false;
		};

		$scope.fieldChangeDefault = function(){
			$scope.credentials.status = true;
			$scope.credentials.workDays = ['lunes','martes','miercoles','jueves','viernes','sabado'];
		};

		$scope.roleChange = function(){
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function() {
			$scope.success = $scope.error = null;
			var user = new Users($scope.credentials);
			var index = $scope.indexUser;

			user.$update(function(response) {
				$scope.userid = response._id;
				$scope.success = true;
				$scope.createHistorial(response, 'Usuario', 'gi gi-group', 'users/userslist' );
				if($scope.avatar){
					$scope.onFileSelect($scope.avatar,function(){
						$scope.msgSmartNotification('Usuario','Se guardo correctamente','fa fa-check','#739E73');
			            $scope.isOk = true;	
						$timeout(function () {
		                	$scope.isOk = undefined;
		            	},1000);	
					});
				}else{
					$scope.msgSmartNotification('Usuario','Se guardo correctamente','fa fa-check','#739E73');
		            $scope.isOk = true;	
					$timeout(function () {
	                	$scope.isOk = undefined;
	            	},1000);
				}
			}, function(response) {

				$scope.error = response.data.message;
				$scope.msgSmartNotification('Error','No se guardo correctamente: '+ $scope.error,'fa fa-frown-o','#C46A69');
	            $scope.isOk = false;	
				$timeout(function () {
                	$scope.isOk = undefined;
            	},1000);
			});
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.listMyUsers = function () {
			$scope.success = $scope.error = null;


			$http.get('/users/userslist' , $scope.user).success(function(response) {
				$scope.success = true;
				$scope.users = response;
				Menus.query(function(response){
					angular.forEach(response, function(value, key){
						$scope.groups[value.name] = value.name;
					});
				});
				$scope.fillCircles(response);

			}).error(function(response){
				$scope.error = response.message;
			});
		};

		$scope.signup = function() {
			var isValid = true;
			if($scope.credentials){
				if(!$scope.credentials.roles){
					$scope.credentials.roles = {0:'user'};
				}				

				if( $scope.credentials.roles[0] === 'user' ||  $scope.credentials.roles[0] === 'admin')
				{	
					$scope.credentials.admin = null;
					$scope.credentials.admin=[];					
					$scope.credentials.admin.push($scope.user.username);
				}
			}else{
				isValid=false;
			}

			if(isValid)
			{
				$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.users.push(response);
					$scope.userid = response._id;
					if($scope.avatar){

						$scope.onFileSelect($scope.avatar, function(){
							$scope.msgSmartNotification('Usuario','Se guardo correctamente','fa fa-check','#739E73');
				            $scope.isOk = false;	
							$timeout(function () {
			                	$scope.isOk = undefined;
			                	//$scope.find();

			            	},1000);
							
							$scope.credentials=null;
						});	
					}else{
						$scope.msgSmartNotification('Usuario','Se guardo correctamente','fa fa-check','#739E73');
			            $scope.isOk = false;	
						$timeout(function () {
		                	$scope.isOk = undefined;
		                	//$scope.find();

		            	},1000);
						$scope.credentials=null;
					}
					$scope.createHistorial(response, 'Usuario', 'gi gi-group', 'users/userslist' );
					
				}).error(function(response) {
					$scope.error = response.message;
					$scope.msgSmartNotification('Error','No se guardo correctamente: '+ $scope.error,'fa fa-frown-o','#C46A69');
		            $scope.isOk = false;	
					$timeout(function () {
	                	$scope.isOk = undefined;
	                	$scope.find();

	            	},1000);
				});
			}else
			{
				$scope.error = 'Llene los campos necesarios';
			}
		};

		$scope.edit = function(user , index){
			$scope.credentials = null;
			$scope.credentials = user;
			$scope.updateCirclesDocument($scope.credentials);
			$scope.indexUser = index;
		};

		$scope.fillCircles = function(response){
			Circulos.query(function(circulos){
				$scope.circulos= [];
				angular.forEach(circulos,function(circulo){
					$scope.circulos.push({ name : circulo.name, _id : circulo._id, checked : false });
				});
			});
		};

		$scope.cleanCredentials = function(){
			$scope.credentials=null;
			$scope.clearCirlces();
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
				//isNew = true;
			}
			
		};

		$scope.deleteAddTelephoneContact = function(index){
			$scope.credentials.telephons.splice(index, 1);
		};

		$scope.dateEndChange = function(){
			if($scope.credentials.endContractDate!=='')
			{
				$scope.credentials.status = false;
			}else
			{
				$scope.credentials.status = true;
			}
				
		};

		$scope.typeUserChange = function(){
			if($scope.credentials.roles.length === 0 )
			{
				$scope.credentials.permissions.canCreate = false;
				$scope.credentials.permissions.canDelete = false;
				$scope.credentials.permissions.canUpdate = false;
			}else if( $scope.credentials.roles[0] === 'admin' ){
				$scope.credentials.permissions.canCreate = true;
				$scope.credentials.permissions.canDelete = true;
				$scope.credentials.permissions.canUpdate = true;

			}else if( $scope.credentials.roles[0] === 'user' )
			{
				$scope.credentials.permissions.canCreate = true;
				$scope.credentials.permissions.canDelete = false;
				$scope.credentials.permissions.canUpdate = true;
			}else if( $scope.credentials.roles[0] === 'other' )
			{
				$scope.credentials.permissions.canCreate = true;
				$scope.credentials.permissions.canDelete = false;
				$scope.credentials.permissions.canUpdate = false;
			}
		};

		$scope.searchName = function(letter){
			$scope.letter = letter;
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
	                $scope.start(j,callback);
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

	    $scope.start = function (index , callback) {
	        $scope.progress[index] = 0;
	        $element.find('div[name=progressBar]').css({'display':'block'});
	        $element.find('div[name=progress]')
	        .css({'width':'0%'})
	        .text('0%')
	        .attr('aria-valuenow',0);
	        $scope.upload[index] = $upload.upload({
	            url: '/users/uploadAvatar',
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
	            $element.find('div[name=progressBar]').css('display','none');
	            $scope.msgSmartNotification('Usuario','Se guardo correctamente','fa fa-check','#739E73');
	            $scope.isOk = false;	
				$timeout(function () {
                	$scope.isOk = undefined;
            	},1000);
	            if(callback)
	            	callback();
	            $scope.upload=[];
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

		//CIRCLES OPTIONS
		$scope.onClickLi = function(index, newCircle, circle){
			$timeout(function(){
				$element.find('div[name="c-options"]').addClass('open');	
			});
			if(!$scope.credentials.circles)
				$scope.credentials.circles=[];
			if(newCircle === 0){
				$scope.newCircle = false;
				if(circle.checked){
					circle.checked = false;
					angular.forEach($scope.credentials.circles, function(circles, key){
						if(circles.idcircle+'' === circle._id+'')
							$scope.credentials.circles.splice(key,1);
					});
				}					
				else{
					circle.checked = true;
					$scope.credentials.circles.push({ name : circle.name, idcircle: circle._id, checked: true });
				}
					

					$scope.updateCirclesDocument($scope.credentials);

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
				//$scope.updateUserProfile();
				$scope.newCircle = false;
				$scope.msgSmartNotification('Círculo','Su círculo fue agregado correctamente','fa fa-check','#739E73');
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
			// Redirect after save
		};

		$scope.updateCirclesDocument = function(response){
			var contTrue = 0;
			var title = '';
			$scope.clearCirlces();
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
			$scope.circulos.total = contTrue;
			$scope.circulos.title = title;
		};

		$scope.clearCirlces = function(){
			angular.forEach($scope.circulos, function(circle){
				if(circle.checked)
					circle.checked=false;
			});
		};


		/*Historials*/
		// Create new Historial
		$scope.createHistorial = function(response, typemov, icon, url ) {
			// Create new Historial object
			var historial = new Historials ({
				typemov : typemov,
				icon : icon,
				url : url,
				user: $scope.user._id,
				from : 'Usuario'
			});
			historial.usuario = response;
			// Redirect after save
			historial.$save(function(response) {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.msgSmartNotification('Error' , $scope.error , 'fa fa-frown-o' , '#C46A69' );
			});
		};
		
	}
]);
