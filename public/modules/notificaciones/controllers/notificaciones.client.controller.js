'use strict';

// Notificaciones controller
angular.module('notificaciones').controller('NotificacionesController', ['$scope', '$stateParams', '$location', '$element' , '$http', '$filter', '$interval', '$timeout', 'Authentication', 'Notificaciones', 'Documentos', 'Socket',
	function($scope, $stateParams, $location ,$element , $http, $filter, $interval, $timeout , Authentication, Notificaciones, Documentos, Socket ) {
		$scope.authentication = Authentication;
		$scope.Total = 0;

		Socket.on('notify.newnotify', function(noty){
			if(!$scope.notificaciones)
				$scope.notificaciones= [];
			$scope.notificaciones.push(noty);
		});	

		Socket.on('contact.newfromdoc', function(noty){
			if(!$scope.notificaciones)
				$scope.notificaciones= [];
			$scope.notificaciones.push(noty);
		});	
		// Create new Notificacione
		$scope.create = function() {
			// Create new Notificacione object
			var notificacione = new Notificaciones ({
				name: this.name
			});

			// Redirect after save
			notificacione.$save(function(response) {
				$location.path('notificaciones/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Notificacione
		$scope.remove = function( notificacione ) {
			if ( notificacione ) { notificacione.$remove();

				for (var i in $scope.notificaciones ) {
					if ($scope.notificaciones [i] === notificacione ) {
						$scope.notificaciones.splice(i, 1);
					}
				}
			} else {
				$scope.notificacione.$remove(function() {
					$location.path('notificaciones');
				});
			}
		};

		// Update existing Notificacione
		$scope.update = function() {
			var notificacione = $scope.notificacione ;

			notificacione.$update(function() {
				$location.path('notificaciones/' + notificacione._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notificaciones
		$scope.find = function() {
			$http.get('/notificaciones').success(function(response) {
				$scope.notificaciones = response;
				$scope.notificaciones.total = response.length;
			}).error(function(response){
				$scope.error = response.message;
			});
		};

		var p = $interval(function (val) {
			var date = new Date();
			date.setDate(date.getDate() + 1);

			var todayStart = $filter('date')(date , 'yyyy-MM-ddT00:00:000Z');
			var todayEnd = $filter('date')(date , 'yyyy-MM-ddT23:59:59Z');

			var dates ={
				start : todayStart ,
				end : todayEnd ,
				title: 'Documento a punto de expirar' ,  
				descripcion : 'El documento %DOC% esta a punto de expirar.' ,
				url : 'documentos' ,
				icon : 'fa fa-plus fa-fw' ,
				alertColor : 'alert-danger'
			};
			$http.post('/documentos/listExpiratedDocuments' , dates ).success(function(response){
				if(response.length > 1 ){
					$scope.msgSmartNotification('Documento','Hay varios documentos que estan a punto de expirar','fa fa-bell','#3276B1');
					$scope.sendNotify();
				}
				if(response.length > 0){
					$scope.msgSmartNotification('Documento','El documento '+response[0].name_document +' tiene una fecha de vencimiento para '+ response[0].date_end,'fa fa-bell','#3276B1');
					$scope.sendNotify();
				}
			}).error(function(responseError){
			});
		}, 10000, 0, false);
		p.then(function (val) {
		}, function (val) {
			console.log('error', val);
		}, function (val) {
		});

		$scope.sendNotify = function(){
			$scope.isNotifed = true;	
			$timeout(function () {
            	$scope.isNotifed = undefined;
        	},1000);
		};

		$scope.msgSmartNotification = function( title,  content, icon, color){
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;
		};

		$scope.thisNotyHasBeenSeen = function(notificacion){
			$http.post('/notificaciones/thisNotyHasBeenSeen', notificacion).success(function(response){
				angular.forEach($scope.notificaciones, function(val,k){
					if(val._id === response._id){
						$scope.notificaciones.splice(response[0],1);
						$scope.notificaciones.total -= 1;
					}
				});
				if(response.idProceso!== undefined)
					$location.path( response.url +'/' + response.idProceso);
				else
					$location.path( response.url );
			}).error(function(responseError){

			});
		};

	}
]);