'use strict';

(function() {
	// Notas Controller Spec
	describe('Notas Controller Tests', function() {
		// Initialize global variables
		var NotasController,
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

			// Initialize the Notas controller.
			NotasController = $controller('NotasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Nota object fetched from XHR', inject(function(Notas) {
			// Create sample Nota using the Notas service
			var sampleNota = new Notas({
				name: 'New Nota'
			});

			// Create a sample Notas array that includes the new Nota
			var sampleNotas = [sampleNota];

			// Set GET response
			$httpBackend.expectGET('notas').respond(sampleNotas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.notas).toEqualData(sampleNotas);
		}));

		it('$scope.findOne() should create an array with one Nota object fetched from XHR using a notaId URL parameter', inject(function(Notas) {
			// Define a sample Nota object
			var sampleNota = new Notas({
				name: 'New Nota'
			});

			// Set the URL parameter
			$stateParams.notaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/notas\/([0-9a-fA-F]{24})$/).respond(sampleNota);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.nota).toEqualData(sampleNota);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Notas) {
			// Create a sample Nota object
			var sampleNotaPostData = new Notas({
				name: 'New Nota'
			});

			// Create a sample Nota response
			var sampleNotaResponse = new Notas({
				_id: '525cf20451979dea2c000001',
				name: 'New Nota'
			});

			// Fixture mock form input values
			scope.name = 'New Nota';

			// Set POST response
			$httpBackend.expectPOST('notas', sampleNotaPostData).respond(sampleNotaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Nota was created
			expect($location.path()).toBe('/notas/' + sampleNotaResponse._id);
		}));

		it('$scope.update() should update a valid Nota', inject(function(Notas) {
			// Define a sample Nota put data
			var sampleNotaPutData = new Notas({
				_id: '525cf20451979dea2c000001',
				name: 'New Nota'
			});

			// Mock Nota in scope
			scope.nota = sampleNotaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/notas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/notas/' + sampleNotaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid notaId and remove the Nota from the scope', inject(function(Notas) {
			// Create new Nota object
			var sampleNota = new Notas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Notas array and include the Nota
			scope.notas = [sampleNota];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/notas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNota);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.notas.length).toBe(0);
		}));
	});
}());