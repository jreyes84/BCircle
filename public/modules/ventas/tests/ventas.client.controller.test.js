'use strict';

(function() {
	// Ventas Controller Spec
	describe('Ventas Controller Tests', function() {
		// Initialize global variables
		var VentasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Ventas controller.
			VentasController = $controller('VentasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Venta object fetched from XHR', inject(function(Ventas) {
			// Create sample Venta using the Ventas service
			var sampleVenta = new Ventas({
				name: 'New Venta'
			});

			// Create a sample Ventas array that includes the new Venta
			var sampleVentas = [sampleVenta];

			// Set GET response
			$httpBackend.expectGET('ventas').respond(sampleVentas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ventas).toEqualData(sampleVentas);
		}));

		it('$scope.findOne() should create an array with one Venta object fetched from XHR using a ventaId URL parameter', inject(function(Ventas) {
			// Define a sample Venta object
			var sampleVenta = new Ventas({
				name: 'New Venta'
			});

			// Set the URL parameter
			$stateParams.ventaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ventas\/([0-9a-fA-F]{24})$/).respond(sampleVenta);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.venta).toEqualData(sampleVenta);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ventas) {
			// Create a sample Venta object
			var sampleVentaPostData = new Ventas({
				name: 'New Venta'
			});

			// Create a sample Venta response
			var sampleVentaResponse = new Ventas({
				_id: '525cf20451979dea2c000001',
				name: 'New Venta'
			});

			// Fixture mock form input values
			scope.name = 'New Venta';

			// Set POST response
			$httpBackend.expectPOST('ventas', sampleVentaPostData).respond(sampleVentaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Venta was created
			expect($location.path()).toBe('/ventas/' + sampleVentaResponse._id);
		}));

		it('$scope.update() should update a valid Venta', inject(function(Ventas) {
			// Define a sample Venta put data
			var sampleVentaPutData = new Ventas({
				_id: '525cf20451979dea2c000001',
				name: 'New Venta'
			});

			// Mock Venta in scope
			scope.venta = sampleVentaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ventas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ventas/' + sampleVentaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ventaId and remove the Venta from the scope', inject(function(Ventas) {
			// Create new Venta object
			var sampleVenta = new Ventas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ventas array and include the Venta
			scope.ventas = [sampleVenta];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ventas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVenta);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ventas.length).toBe(0);
		}));
	});
}());