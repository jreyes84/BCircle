'use strict';

(function() {
	// Promocions Controller Spec
	describe('Promocions Controller Tests', function() {
		// Initialize global variables
		var PromocionsController,
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

			// Initialize the Promocions controller.
			PromocionsController = $controller('PromocionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Promocion object fetched from XHR', inject(function(Promocions) {
			// Create sample Promocion using the Promocions service
			var samplePromocion = new Promocions({
				name: 'New Promocion'
			});

			// Create a sample Promocions array that includes the new Promocion
			var samplePromocions = [samplePromocion];

			// Set GET response
			$httpBackend.expectGET('promocions').respond(samplePromocions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.promocions).toEqualData(samplePromocions);
		}));

		it('$scope.findOne() should create an array with one Promocion object fetched from XHR using a promocionId URL parameter', inject(function(Promocions) {
			// Define a sample Promocion object
			var samplePromocion = new Promocions({
				name: 'New Promocion'
			});

			// Set the URL parameter
			$stateParams.promocionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/promocions\/([0-9a-fA-F]{24})$/).respond(samplePromocion);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.promocion).toEqualData(samplePromocion);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Promocions) {
			// Create a sample Promocion object
			var samplePromocionPostData = new Promocions({
				name: 'New Promocion'
			});

			// Create a sample Promocion response
			var samplePromocionResponse = new Promocions({
				_id: '525cf20451979dea2c000001',
				name: 'New Promocion'
			});

			// Fixture mock form input values
			scope.name = 'New Promocion';

			// Set POST response
			$httpBackend.expectPOST('promocions', samplePromocionPostData).respond(samplePromocionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Promocion was created
			expect($location.path()).toBe('/promocions/' + samplePromocionResponse._id);
		}));

		it('$scope.update() should update a valid Promocion', inject(function(Promocions) {
			// Define a sample Promocion put data
			var samplePromocionPutData = new Promocions({
				_id: '525cf20451979dea2c000001',
				name: 'New Promocion'
			});

			// Mock Promocion in scope
			scope.promocion = samplePromocionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/promocions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/promocions/' + samplePromocionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid promocionId and remove the Promocion from the scope', inject(function(Promocions) {
			// Create new Promocion object
			var samplePromocion = new Promocions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Promocions array and include the Promocion
			scope.promocions = [samplePromocion];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/promocions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePromocion);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.promocions.length).toBe(0);
		}));
	});
}());