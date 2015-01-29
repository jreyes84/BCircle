'use strict';

(function() {
	// Historials Controller Spec
	describe('Historials Controller Tests', function() {
		// Initialize global variables
		var HistorialsController,
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

			// Initialize the Historials controller.
			HistorialsController = $controller('HistorialsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Historial object fetched from XHR', inject(function(Historials) {
			// Create sample Historial using the Historials service
			var sampleHistorial = new Historials({
				name: 'New Historial'
			});

			// Create a sample Historials array that includes the new Historial
			var sampleHistorials = [sampleHistorial];

			// Set GET response
			$httpBackend.expectGET('historials').respond(sampleHistorials);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.historials).toEqualData(sampleHistorials);
		}));

		it('$scope.findOne() should create an array with one Historial object fetched from XHR using a historialId URL parameter', inject(function(Historials) {
			// Define a sample Historial object
			var sampleHistorial = new Historials({
				name: 'New Historial'
			});

			// Set the URL parameter
			$stateParams.historialId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/historials\/([0-9a-fA-F]{24})$/).respond(sampleHistorial);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.historial).toEqualData(sampleHistorial);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Historials) {
			// Create a sample Historial object
			var sampleHistorialPostData = new Historials({
				name: 'New Historial'
			});

			// Create a sample Historial response
			var sampleHistorialResponse = new Historials({
				_id: '525cf20451979dea2c000001',
				name: 'New Historial'
			});

			// Fixture mock form input values
			scope.name = 'New Historial';

			// Set POST response
			$httpBackend.expectPOST('historials', sampleHistorialPostData).respond(sampleHistorialResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Historial was created
			expect($location.path()).toBe('/historials/' + sampleHistorialResponse._id);
		}));

		it('$scope.update() should update a valid Historial', inject(function(Historials) {
			// Define a sample Historial put data
			var sampleHistorialPutData = new Historials({
				_id: '525cf20451979dea2c000001',
				name: 'New Historial'
			});

			// Mock Historial in scope
			scope.historial = sampleHistorialPutData;

			// Set PUT response
			$httpBackend.expectPUT(/historials\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/historials/' + sampleHistorialPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid historialId and remove the Historial from the scope', inject(function(Historials) {
			// Create new Historial object
			var sampleHistorial = new Historials({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Historials array and include the Historial
			scope.historials = [sampleHistorial];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/historials\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHistorial);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.historials.length).toBe(0);
		}));
	});
}());