'use strict';

(function() {
	// Movimientos Controller Spec
	describe('Movimientos Controller Tests', function() {
		// Initialize global variables
		var MovimientosController,
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

			// Initialize the Movimientos controller.
			MovimientosController = $controller('MovimientosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Movimiento object fetched from XHR', inject(function(Movimientos) {
			// Create sample Movimiento using the Movimientos service
			var sampleMovimiento = new Movimientos({
				name: 'New Movimiento'
			});

			// Create a sample Movimientos array that includes the new Movimiento
			var sampleMovimientos = [sampleMovimiento];

			// Set GET response
			$httpBackend.expectGET('movimientos').respond(sampleMovimientos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.movimientos).toEqualData(sampleMovimientos);
		}));

		it('$scope.findOne() should create an array with one Movimiento object fetched from XHR using a movimientoId URL parameter', inject(function(Movimientos) {
			// Define a sample Movimiento object
			var sampleMovimiento = new Movimientos({
				name: 'New Movimiento'
			});

			// Set the URL parameter
			$stateParams.movimientoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/movimientos\/([0-9a-fA-F]{24})$/).respond(sampleMovimiento);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.movimiento).toEqualData(sampleMovimiento);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Movimientos) {
			// Create a sample Movimiento object
			var sampleMovimientoPostData = new Movimientos({
				name: 'New Movimiento'
			});

			// Create a sample Movimiento response
			var sampleMovimientoResponse = new Movimientos({
				_id: '525cf20451979dea2c000001',
				name: 'New Movimiento'
			});

			// Fixture mock form input values
			scope.name = 'New Movimiento';

			// Set POST response
			$httpBackend.expectPOST('movimientos', sampleMovimientoPostData).respond(sampleMovimientoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Movimiento was created
			expect($location.path()).toBe('/movimientos/' + sampleMovimientoResponse._id);
		}));

		it('$scope.update() should update a valid Movimiento', inject(function(Movimientos) {
			// Define a sample Movimiento put data
			var sampleMovimientoPutData = new Movimientos({
				_id: '525cf20451979dea2c000001',
				name: 'New Movimiento'
			});

			// Mock Movimiento in scope
			scope.movimiento = sampleMovimientoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/movimientos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/movimientos/' + sampleMovimientoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid movimientoId and remove the Movimiento from the scope', inject(function(Movimientos) {
			// Create new Movimiento object
			var sampleMovimiento = new Movimientos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Movimientos array and include the Movimiento
			scope.movimientos = [sampleMovimiento];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/movimientos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMovimiento);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.movimientos.length).toBe(0);
		}));
	});
}());