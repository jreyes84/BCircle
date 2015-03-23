'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('listProducts', {
			url: '/products',
			templateUrl: 'modules/products/views/table-products.client.view.html'
		}).
		state('createProduct', {
			url: '/products/create',
			templateUrl: 'modules/products/views/create-product.client.view.html'
		}).
		state('viewProduct', {
			url: '/products/:productId',
			templateUrl: 'modules/products/views/table-product.client.view.html'
		}).
		state('advanceProduct', {
			url: '/products/:productId/advance',
			templateUrl: 'modules/products/views/advance-product.client.view.html'
		});
	}
]);