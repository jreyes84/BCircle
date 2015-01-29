'use strict';

angular.module('core').controller('CoreController', ['$scope', '$http', '$stateParams' , '$filter' , '$element', '$location', '$interval', '$timeout', 'Authentication', 'Documentos',
	function($scope, $http, $stateParams , $filter , $element, $location, $interval,  $timeout, Authentication, Documentos) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.users = Authentication.user;		
	}
]);