'use strict';

(function() {
	// Polizas Controller Spec
	describe('Polizas Controller Tests', function() {
		// Initialize global variables
		var PolizasController,
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

			// Initialize the Polizas controller.
			PolizasController = $controller('PolizasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Poliza object fetched from XHR', inject(function(Polizas) {
			// Create sample Poliza using the Polizas service
			var samplePoliza = new Polizas({
				name: 'New Poliza'
			});

			// Create a sample Polizas array that includes the new Poliza
			var samplePolizas = [samplePoliza];

			// Set GET response
			$httpBackend.expectGET('polizas').respond(samplePolizas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.polizas).toEqualData(samplePolizas);
		}));

		it('$scope.findOne() should create an array with one Poliza object fetched from XHR using a polizaId URL parameter', inject(function(Polizas) {
			// Define a sample Poliza object
			var samplePoliza = new Polizas({
				name: 'New Poliza'
			});

			// Set the URL parameter
			$stateParams.polizaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/polizas\/([0-9a-fA-F]{24})$/).respond(samplePoliza);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.poliza).toEqualData(samplePoliza);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Polizas) {
			// Create a sample Poliza object
			var samplePolizaPostData = new Polizas({
				name: 'New Poliza'
			});

			// Create a sample Poliza response
			var samplePolizaResponse = new Polizas({
				_id: '525cf20451979dea2c000001',
				name: 'New Poliza'
			});

			// Fixture mock form input values
			scope.name = 'New Poliza';

			// Set POST response
			$httpBackend.expectPOST('polizas', samplePolizaPostData).respond(samplePolizaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Poliza was created
			expect($location.path()).toBe('/polizas/' + samplePolizaResponse._id);
		}));

		it('$scope.update() should update a valid Poliza', inject(function(Polizas) {
			// Define a sample Poliza put data
			var samplePolizaPutData = new Polizas({
				_id: '525cf20451979dea2c000001',
				name: 'New Poliza'
			});

			// Mock Poliza in scope
			scope.poliza = samplePolizaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/polizas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/polizas/' + samplePolizaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid polizaId and remove the Poliza from the scope', inject(function(Polizas) {
			// Create new Poliza object
			var samplePoliza = new Polizas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Polizas array and include the Poliza
			scope.polizas = [samplePoliza];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/polizas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePoliza);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.polizas.length).toBe(0);
		}));
	});
}());