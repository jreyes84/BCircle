'use strict';

(function() {
	// Grupoproductos Controller Spec
	describe('Grupoproductos Controller Tests', function() {
		// Initialize global variables
		var GrupoproductosController,
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

			// Initialize the Grupoproductos controller.
			GrupoproductosController = $controller('GrupoproductosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Grupoproducto object fetched from XHR', inject(function(Grupoproductos) {
			// Create sample Grupoproducto using the Grupoproductos service
			var sampleGrupoproducto = new Grupoproductos({
				name: 'New Grupoproducto'
			});

			// Create a sample Grupoproductos array that includes the new Grupoproducto
			var sampleGrupoproductos = [sampleGrupoproducto];

			// Set GET response
			$httpBackend.expectGET('grupoproductos').respond(sampleGrupoproductos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grupoproductos).toEqualData(sampleGrupoproductos);
		}));

		it('$scope.findOne() should create an array with one Grupoproducto object fetched from XHR using a grupoproductoId URL parameter', inject(function(Grupoproductos) {
			// Define a sample Grupoproducto object
			var sampleGrupoproducto = new Grupoproductos({
				name: 'New Grupoproducto'
			});

			// Set the URL parameter
			$stateParams.grupoproductoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/grupoproductos\/([0-9a-fA-F]{24})$/).respond(sampleGrupoproducto);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grupoproducto).toEqualData(sampleGrupoproducto);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Grupoproductos) {
			// Create a sample Grupoproducto object
			var sampleGrupoproductoPostData = new Grupoproductos({
				name: 'New Grupoproducto'
			});

			// Create a sample Grupoproducto response
			var sampleGrupoproductoResponse = new Grupoproductos({
				_id: '525cf20451979dea2c000001',
				name: 'New Grupoproducto'
			});

			// Fixture mock form input values
			scope.name = 'New Grupoproducto';

			// Set POST response
			$httpBackend.expectPOST('grupoproductos', sampleGrupoproductoPostData).respond(sampleGrupoproductoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Grupoproducto was created
			expect($location.path()).toBe('/grupoproductos/' + sampleGrupoproductoResponse._id);
		}));

		it('$scope.update() should update a valid Grupoproducto', inject(function(Grupoproductos) {
			// Define a sample Grupoproducto put data
			var sampleGrupoproductoPutData = new Grupoproductos({
				_id: '525cf20451979dea2c000001',
				name: 'New Grupoproducto'
			});

			// Mock Grupoproducto in scope
			scope.grupoproducto = sampleGrupoproductoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/grupoproductos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/grupoproductos/' + sampleGrupoproductoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid grupoproductoId and remove the Grupoproducto from the scope', inject(function(Grupoproductos) {
			// Create new Grupoproducto object
			var sampleGrupoproducto = new Grupoproductos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Grupoproductos array and include the Grupoproducto
			scope.grupoproductos = [sampleGrupoproducto];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/grupoproductos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGrupoproducto);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.grupoproductos.length).toBe(0);
		}));
	});
}());