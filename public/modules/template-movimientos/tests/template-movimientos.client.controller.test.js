'use strict';

(function() {
	// Template movimientos Controller Spec
	describe('Template movimientos Controller Tests', function() {
		// Initialize global variables
		var TemplateMovimientosController,
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

			// Initialize the Template movimientos controller.
			TemplateMovimientosController = $controller('TemplateMovimientosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Template movimiento object fetched from XHR', inject(function(TemplateMovimientos) {
			// Create sample Template movimiento using the Template movimientos service
			var sampleTemplateMovimiento = new TemplateMovimientos({
				name: 'New Template movimiento'
			});

			// Create a sample Template movimientos array that includes the new Template movimiento
			var sampleTemplateMovimientos = [sampleTemplateMovimiento];

			// Set GET response
			$httpBackend.expectGET('template-movimientos').respond(sampleTemplateMovimientos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.templateMovimientos).toEqualData(sampleTemplateMovimientos);
		}));

		it('$scope.findOne() should create an array with one Template movimiento object fetched from XHR using a templateMovimientoId URL parameter', inject(function(TemplateMovimientos) {
			// Define a sample Template movimiento object
			var sampleTemplateMovimiento = new TemplateMovimientos({
				name: 'New Template movimiento'
			});

			// Set the URL parameter
			$stateParams.templateMovimientoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/template-movimientos\/([0-9a-fA-F]{24})$/).respond(sampleTemplateMovimiento);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.templateMovimiento).toEqualData(sampleTemplateMovimiento);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(TemplateMovimientos) {
			// Create a sample Template movimiento object
			var sampleTemplateMovimientoPostData = new TemplateMovimientos({
				name: 'New Template movimiento'
			});

			// Create a sample Template movimiento response
			var sampleTemplateMovimientoResponse = new TemplateMovimientos({
				_id: '525cf20451979dea2c000001',
				name: 'New Template movimiento'
			});

			// Fixture mock form input values
			scope.name = 'New Template movimiento';

			// Set POST response
			$httpBackend.expectPOST('template-movimientos', sampleTemplateMovimientoPostData).respond(sampleTemplateMovimientoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Template movimiento was created
			expect($location.path()).toBe('/template-movimientos/' + sampleTemplateMovimientoResponse._id);
		}));

		it('$scope.update() should update a valid Template movimiento', inject(function(TemplateMovimientos) {
			// Define a sample Template movimiento put data
			var sampleTemplateMovimientoPutData = new TemplateMovimientos({
				_id: '525cf20451979dea2c000001',
				name: 'New Template movimiento'
			});

			// Mock Template movimiento in scope
			scope.templateMovimiento = sampleTemplateMovimientoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/template-movimientos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/template-movimientos/' + sampleTemplateMovimientoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid templateMovimientoId and remove the Template movimiento from the scope', inject(function(TemplateMovimientos) {
			// Create new Template movimiento object
			var sampleTemplateMovimiento = new TemplateMovimientos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Template movimientos array and include the Template movimiento
			scope.templateMovimientos = [sampleTemplateMovimiento];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/template-movimientos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTemplateMovimiento);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.templateMovimientos.length).toBe(0);
		}));
	});
}());