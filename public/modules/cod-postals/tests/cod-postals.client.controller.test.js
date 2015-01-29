'use strict';

(function() {
	// Cod postals Controller Spec
	describe('Cod postals Controller Tests', function() {
		// Initialize global variables
		var CodPostalsController,
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

			// Initialize the Cod postals controller.
			CodPostalsController = $controller('CodPostalsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cod postal object fetched from XHR', inject(function(CodPostals) {
			// Create sample Cod postal using the Cod postals service
			var sampleCodPostal = new CodPostals({
				name: 'New Cod postal'
			});

			// Create a sample Cod postals array that includes the new Cod postal
			var sampleCodPostals = [sampleCodPostal];

			// Set GET response
			$httpBackend.expectGET('cod-postals').respond(sampleCodPostals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.codPostals).toEqualData(sampleCodPostals);
		}));

		it('$scope.findOne() should create an array with one Cod postal object fetched from XHR using a codPostalId URL parameter', inject(function(CodPostals) {
			// Define a sample Cod postal object
			var sampleCodPostal = new CodPostals({
				name: 'New Cod postal'
			});

			// Set the URL parameter
			$stateParams.codPostalId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cod-postals\/([0-9a-fA-F]{24})$/).respond(sampleCodPostal);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.codPostal).toEqualData(sampleCodPostal);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CodPostals) {
			// Create a sample Cod postal object
			var sampleCodPostalPostData = new CodPostals({
				name: 'New Cod postal'
			});

			// Create a sample Cod postal response
			var sampleCodPostalResponse = new CodPostals({
				_id: '525cf20451979dea2c000001',
				name: 'New Cod postal'
			});

			// Fixture mock form input values
			scope.name = 'New Cod postal';

			// Set POST response
			$httpBackend.expectPOST('cod-postals', sampleCodPostalPostData).respond(sampleCodPostalResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cod postal was created
			expect($location.path()).toBe('/cod-postals/' + sampleCodPostalResponse._id);
		}));

		it('$scope.update() should update a valid Cod postal', inject(function(CodPostals) {
			// Define a sample Cod postal put data
			var sampleCodPostalPutData = new CodPostals({
				_id: '525cf20451979dea2c000001',
				name: 'New Cod postal'
			});

			// Mock Cod postal in scope
			scope.codPostal = sampleCodPostalPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cod-postals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cod-postals/' + sampleCodPostalPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid codPostalId and remove the Cod postal from the scope', inject(function(CodPostals) {
			// Create new Cod postal object
			var sampleCodPostal = new CodPostals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cod postals array and include the Cod postal
			scope.codPostals = [sampleCodPostal];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cod-postals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCodPostal);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.codPostals.length).toBe(0);
		}));
	});
}());