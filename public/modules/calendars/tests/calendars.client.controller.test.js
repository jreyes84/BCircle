'use strict';

(function() {
	// Calendars Controller Spec
	describe('Calendars Controller Tests', function() {
		// Initialize global variables
		var CalendarsController,
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

			// Initialize the Calendars controller.
			CalendarsController = $controller('CalendarsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Calendar object fetched from XHR', inject(function(Calendars) {
			// Create sample Calendar using the Calendars service
			var sampleCalendar = new Calendars({
				name: 'New Calendar'
			});

			// Create a sample Calendars array that includes the new Calendar
			var sampleCalendars = [sampleCalendar];

			// Set GET response
			$httpBackend.expectGET('calendars').respond(sampleCalendars);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendars).toEqualData(sampleCalendars);
		}));

		it('$scope.findOne() should create an array with one Calendar object fetched from XHR using a calendarId URL parameter', inject(function(Calendars) {
			// Define a sample Calendar object
			var sampleCalendar = new Calendars({
				name: 'New Calendar'
			});

			// Set the URL parameter
			$stateParams.calendarId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/calendars\/([0-9a-fA-F]{24})$/).respond(sampleCalendar);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.calendar).toEqualData(sampleCalendar);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Calendars) {
			// Create a sample Calendar object
			var sampleCalendarPostData = new Calendars({
				name: 'New Calendar'
			});

			// Create a sample Calendar response
			var sampleCalendarResponse = new Calendars({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendar'
			});

			// Fixture mock form input values
			scope.name = 'New Calendar';

			// Set POST response
			$httpBackend.expectPOST('calendars', sampleCalendarPostData).respond(sampleCalendarResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Calendar was created
			expect($location.path()).toBe('/calendars/' + sampleCalendarResponse._id);
		}));

		it('$scope.update() should update a valid Calendar', inject(function(Calendars) {
			// Define a sample Calendar put data
			var sampleCalendarPutData = new Calendars({
				_id: '525cf20451979dea2c000001',
				name: 'New Calendar'
			});

			// Mock Calendar in scope
			scope.calendar = sampleCalendarPutData;

			// Set PUT response
			$httpBackend.expectPUT(/calendars\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/calendars/' + sampleCalendarPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid calendarId and remove the Calendar from the scope', inject(function(Calendars) {
			// Create new Calendar object
			var sampleCalendar = new Calendars({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Calendars array and include the Calendar
			scope.calendars = [sampleCalendar];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/calendars\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCalendar);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.calendars.length).toBe(0);
		}));
	});
}());