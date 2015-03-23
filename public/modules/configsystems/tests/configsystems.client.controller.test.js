'use strict';

(function() {
	// Configsystems Controller Spec
	describe('Configsystems Controller Tests', function() {
		// Initialize global variables
		var ConfigsystemsController,
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

			// Initialize the Configsystems controller.
			ConfigsystemsController = $controller('ConfigsystemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Configsystem object fetched from XHR', inject(function(Configsystems) {
			// Create sample Configsystem using the Configsystems service
			var sampleConfigsystem = new Configsystems({
				name: 'New Configsystem'
			});

			// Create a sample Configsystems array that includes the new Configsystem
			var sampleConfigsystems = [sampleConfigsystem];

			// Set GET response
			$httpBackend.expectGET('configsystems').respond(sampleConfigsystems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.configsystems).toEqualData(sampleConfigsystems);
		}));

		it('$scope.findOne() should create an array with one Configsystem object fetched from XHR using a configsystemId URL parameter', inject(function(Configsystems) {
			// Define a sample Configsystem object
			var sampleConfigsystem = new Configsystems({
				name: 'New Configsystem'
			});

			// Set the URL parameter
			$stateParams.configsystemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/configsystems\/([0-9a-fA-F]{24})$/).respond(sampleConfigsystem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.configsystem).toEqualData(sampleConfigsystem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Configsystems) {
			// Create a sample Configsystem object
			var sampleConfigsystemPostData = new Configsystems({
				name: 'New Configsystem'
			});

			// Create a sample Configsystem response
			var sampleConfigsystemResponse = new Configsystems({
				_id: '525cf20451979dea2c000001',
				name: 'New Configsystem'
			});

			// Fixture mock form input values
			scope.name = 'New Configsystem';

			// Set POST response
			$httpBackend.expectPOST('configsystems', sampleConfigsystemPostData).respond(sampleConfigsystemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Configsystem was created
			expect($location.path()).toBe('/configsystems/' + sampleConfigsystemResponse._id);
		}));

		it('$scope.update() should update a valid Configsystem', inject(function(Configsystems) {
			// Define a sample Configsystem put data
			var sampleConfigsystemPutData = new Configsystems({
				_id: '525cf20451979dea2c000001',
				name: 'New Configsystem'
			});

			// Mock Configsystem in scope
			scope.configsystem = sampleConfigsystemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/configsystems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/configsystems/' + sampleConfigsystemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid configsystemId and remove the Configsystem from the scope', inject(function(Configsystems) {
			// Create new Configsystem object
			var sampleConfigsystem = new Configsystems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Configsystems array and include the Configsystem
			scope.configsystems = [sampleConfigsystem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/configsystems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleConfigsystem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.configsystems.length).toBe(0);
		}));
	});
}());