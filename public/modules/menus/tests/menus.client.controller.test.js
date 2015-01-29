'use strict';

(function() {
	// Menus Controller Spec
	describe('Menus Controller Tests', function() {
		// Initialize global variables
		var MenusController,
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

			// Initialize the Menus controller.
			MenusController = $controller('MenusController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Menu object fetched from XHR', inject(function(Menus) {
			// Create sample Menu using the Menus service
			var sampleMenu = new Menus({
				name: 'New Menu'
			});

			// Create a sample Menus array that includes the new Menu
			var sampleMenus = [sampleMenu];

			// Set GET response
			$httpBackend.expectGET('menus').respond(sampleMenus);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.menus).toEqualData(sampleMenus);
		}));

		it('$scope.findOne() should create an array with one Menu object fetched from XHR using a menuId URL parameter', inject(function(Menus) {
			// Define a sample Menu object
			var sampleMenu = new Menus({
				name: 'New Menu'
			});

			// Set the URL parameter
			$stateParams.menuId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/menus\/([0-9a-fA-F]{24})$/).respond(sampleMenu);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.menu).toEqualData(sampleMenu);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Menus) {
			// Create a sample Menu object
			var sampleMenuPostData = new Menus({
				name: 'New Menu'
			});

			// Create a sample Menu response
			var sampleMenuResponse = new Menus({
				_id: '525cf20451979dea2c000001',
				name: 'New Menu'
			});

			// Fixture mock form input values
			scope.name = 'New Menu';

			// Set POST response
			$httpBackend.expectPOST('menus', sampleMenuPostData).respond(sampleMenuResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Menu was created
			expect($location.path()).toBe('/menus/' + sampleMenuResponse._id);
		}));

		it('$scope.update() should update a valid Menu', inject(function(Menus) {
			// Define a sample Menu put data
			var sampleMenuPutData = new Menus({
				_id: '525cf20451979dea2c000001',
				name: 'New Menu'
			});

			// Mock Menu in scope
			scope.menu = sampleMenuPutData;

			// Set PUT response
			$httpBackend.expectPUT(/menus\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/menus/' + sampleMenuPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid menuId and remove the Menu from the scope', inject(function(Menus) {
			// Create new Menu object
			var sampleMenu = new Menus({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Menus array and include the Menu
			scope.menus = [sampleMenu];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/menus\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMenu);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.menus.length).toBe(0);
		}));
	});
}());