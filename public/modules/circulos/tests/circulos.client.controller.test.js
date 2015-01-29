'use strict';

(function() {
	// Circulos Controller Spec
	describe('Circulos Controller Tests', function() {
		// Initialize global variables
		var CirculosController,
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

			// Initialize the Circulos controller.
			CirculosController = $controller('CirculosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Circulo object fetched from XHR', inject(function(Circulos) {
			// Create sample Circulo using the Circulos service
			var sampleCirculo = new Circulos({
				name: 'New Circulo'
			});

			// Create a sample Circulos array that includes the new Circulo
			var sampleCirculos = [sampleCirculo];

			// Set GET response
			$httpBackend.expectGET('circulos').respond(sampleCirculos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.circulos).toEqualData(sampleCirculos);
		}));

		it('$scope.findOne() should create an array with one Circulo object fetched from XHR using a circuloId URL parameter', inject(function(Circulos) {
			// Define a sample Circulo object
			var sampleCirculo = new Circulos({
				name: 'New Circulo'
			});

			// Set the URL parameter
			$stateParams.circuloId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/circulos\/([0-9a-fA-F]{24})$/).respond(sampleCirculo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.circulo).toEqualData(sampleCirculo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Circulos) {
			// Create a sample Circulo object
			var sampleCirculoPostData = new Circulos({
				name: 'New Circulo'
			});

			// Create a sample Circulo response
			var sampleCirculoResponse = new Circulos({
				_id: '525cf20451979dea2c000001',
				name: 'New Circulo'
			});

			// Fixture mock form input values
			scope.name = 'New Circulo';

			// Set POST response
			$httpBackend.expectPOST('circulos', sampleCirculoPostData).respond(sampleCirculoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Circulo was created
			expect($location.path()).toBe('/circulos/' + sampleCirculoResponse._id);
		}));

		it('$scope.update() should update a valid Circulo', inject(function(Circulos) {
			// Define a sample Circulo put data
			var sampleCirculoPutData = new Circulos({
				_id: '525cf20451979dea2c000001',
				name: 'New Circulo'
			});

			// Mock Circulo in scope
			scope.circulo = sampleCirculoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/circulos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/circulos/' + sampleCirculoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid circuloId and remove the Circulo from the scope', inject(function(Circulos) {
			// Create new Circulo object
			var sampleCirculo = new Circulos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Circulos array and include the Circulo
			scope.circulos = [sampleCirculo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/circulos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCirculo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.circulos.length).toBe(0);
		}));
	});
}());