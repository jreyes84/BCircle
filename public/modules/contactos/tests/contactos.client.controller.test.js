'use strict';

(function() {
	// Contactos Controller Spec
	describe('Contactos Controller Tests', function() {
		// Initialize global variables
		var ContactosController,
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

			// Initialize the Contactos controller.
			ContactosController = $controller('ContactosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Contacto object fetched from XHR', inject(function(Contactos) {
			// Create sample Contacto using the Contactos service
			var sampleContacto = new Contactos({
				name: 'New Contacto'
			});

			// Create a sample Contactos array that includes the new Contacto
			var sampleContactos = [sampleContacto];

			// Set GET response
			$httpBackend.expectGET('contactos').respond(sampleContactos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contactos).toEqualData(sampleContactos);
		}));

		it('$scope.findOne() should create an array with one Contacto object fetched from XHR using a contactoId URL parameter', inject(function(Contactos) {
			// Define a sample Contacto object
			var sampleContacto = new Contactos({
				name: 'New Contacto'
			});

			// Set the URL parameter
			$stateParams.contactoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/contactos\/([0-9a-fA-F]{24})$/).respond(sampleContacto);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contacto).toEqualData(sampleContacto);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Contactos) {
			// Create a sample Contacto object
			var sampleContactoPostData = new Contactos({
				name: 'New Contacto'
			});

			// Create a sample Contacto response
			var sampleContactoResponse = new Contactos({
				_id: '525cf20451979dea2c000001',
				name: 'New Contacto'
			});

			// Fixture mock form input values
			scope.name = 'New Contacto';

			// Set POST response
			$httpBackend.expectPOST('contactos', sampleContactoPostData).respond(sampleContactoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Contacto was created
			expect($location.path()).toBe('/contactos/' + sampleContactoResponse._id);
		}));

		it('$scope.update() should update a valid Contacto', inject(function(Contactos) {
			// Define a sample Contacto put data
			var sampleContactoPutData = new Contactos({
				_id: '525cf20451979dea2c000001',
				name: 'New Contacto'
			});

			// Mock Contacto in scope
			scope.contacto = sampleContactoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/contactos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/contactos/' + sampleContactoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid contactoId and remove the Contacto from the scope', inject(function(Contactos) {
			// Create new Contacto object
			var sampleContacto = new Contactos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Contactos array and include the Contacto
			scope.contactos = [sampleContacto];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/contactos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleContacto);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.contactos.length).toBe(0);
		}));
	});
}());