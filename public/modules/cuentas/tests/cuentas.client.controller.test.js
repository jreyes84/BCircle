'use strict';

(function() {
	// Cuentas Controller Spec
	describe('Cuentas Controller Tests', function() {
		// Initialize global variables
		var CuentasController,
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

			// Initialize the Cuentas controller.
			CuentasController = $controller('CuentasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cuenta object fetched from XHR', inject(function(Cuentas) {
			// Create sample Cuenta using the Cuentas service
			var sampleCuenta = new Cuentas({
				name: 'New Cuenta'
			});

			// Create a sample Cuentas array that includes the new Cuenta
			var sampleCuentas = [sampleCuenta];

			// Set GET response
			$httpBackend.expectGET('cuentas').respond(sampleCuentas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cuentas).toEqualData(sampleCuentas);
		}));

		it('$scope.findOne() should create an array with one Cuenta object fetched from XHR using a cuentaId URL parameter', inject(function(Cuentas) {
			// Define a sample Cuenta object
			var sampleCuenta = new Cuentas({
				name: 'New Cuenta'
			});

			// Set the URL parameter
			$stateParams.cuentaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cuentas\/([0-9a-fA-F]{24})$/).respond(sampleCuenta);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cuenta).toEqualData(sampleCuenta);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cuentas) {
			// Create a sample Cuenta object
			var sampleCuentaPostData = new Cuentas({
				name: 'New Cuenta'
			});

			// Create a sample Cuenta response
			var sampleCuentaResponse = new Cuentas({
				_id: '525cf20451979dea2c000001',
				name: 'New Cuenta'
			});

			// Fixture mock form input values
			scope.name = 'New Cuenta';

			// Set POST response
			$httpBackend.expectPOST('cuentas', sampleCuentaPostData).respond(sampleCuentaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cuenta was created
			expect($location.path()).toBe('/cuentas/' + sampleCuentaResponse._id);
		}));

		it('$scope.update() should update a valid Cuenta', inject(function(Cuentas) {
			// Define a sample Cuenta put data
			var sampleCuentaPutData = new Cuentas({
				_id: '525cf20451979dea2c000001',
				name: 'New Cuenta'
			});

			// Mock Cuenta in scope
			scope.cuenta = sampleCuentaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cuentas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cuentas/' + sampleCuentaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cuentaId and remove the Cuenta from the scope', inject(function(Cuentas) {
			// Create new Cuenta object
			var sampleCuenta = new Cuentas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cuentas array and include the Cuenta
			scope.cuentas = [sampleCuenta];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cuentas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCuenta);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cuentas.length).toBe(0);
		}));
	});
}());