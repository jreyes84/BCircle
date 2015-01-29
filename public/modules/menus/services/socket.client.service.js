'use strict';
/*global io:false */
angular.module('menus').factory('Socket', [ 'socketFactory',
	function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
    }
]);