'use strict';

(function() {
	// Rpts Controller Spec
	describe('Rpts Controller Tests', function() {
		// Initialize global variables
		var RptsController,
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

			// Initialize the Rpts controller.
			RptsController = $controller('RptsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rpt object fetched from XHR', inject(function(Rpts) {
			// Create sample Rpt using the Rpts service
			var sampleRpt = new Rpts({
				name: 'New Rpt'
			});

			// Create a sample Rpts array that includes the new Rpt
			var sampleRpts = [sampleRpt];

			// Set GET response
			$httpBackend.expectGET('rpts').respond(sampleRpts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rpts).toEqualData(sampleRpts);
		}));

		it('$scope.findOne() should create an array with one Rpt object fetched from XHR using a rptId URL parameter', inject(function(Rpts) {
			// Define a sample Rpt object
			var sampleRpt = new Rpts({
				name: 'New Rpt'
			});

			// Set the URL parameter
			$stateParams.rptId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rpts\/([0-9a-fA-F]{24})$/).respond(sampleRpt);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rpt).toEqualData(sampleRpt);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rpts) {
			// Create a sample Rpt object
			var sampleRptPostData = new Rpts({
				name: 'New Rpt'
			});

			// Create a sample Rpt response
			var sampleRptResponse = new Rpts({
				_id: '525cf20451979dea2c000001',
				name: 'New Rpt'
			});

			// Fixture mock form input values
			scope.name = 'New Rpt';

			// Set POST response
			$httpBackend.expectPOST('rpts', sampleRptPostData).respond(sampleRptResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rpt was created
			expect($location.path()).toBe('/rpts/' + sampleRptResponse._id);
		}));

		it('$scope.update() should update a valid Rpt', inject(function(Rpts) {
			// Define a sample Rpt put data
			var sampleRptPutData = new Rpts({
				_id: '525cf20451979dea2c000001',
				name: 'New Rpt'
			});

			// Mock Rpt in scope
			scope.rpt = sampleRptPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rpts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rpts/' + sampleRptPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rptId and remove the Rpt from the scope', inject(function(Rpts) {
			// Create new Rpt object
			var sampleRpt = new Rpts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rpts array and include the Rpt
			scope.rpts = [sampleRpt];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rpts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRpt);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rpts.length).toBe(0);
		}));
	});
}());