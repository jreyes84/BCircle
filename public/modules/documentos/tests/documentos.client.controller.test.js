'use strict';

(function() {
	// Documentos Controller Spec
	describe('Documentos Controller Tests', function() {
		// Initialize global variables
		var DocumentosController,
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

			// Initialize the Documentos controller.
			DocumentosController = $controller('DocumentosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Documento object fetched from XHR', inject(function(Documentos) {
			// Create sample Documento using the Documentos service
			var sampleDocumento = new Documentos({
				name: 'New Documento'
			});

			// Create a sample Documentos array that includes the new Documento
			var sampleDocumentos = [sampleDocumento];

			// Set GET response
			$httpBackend.expectGET('documentos').respond(sampleDocumentos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.documentos).toEqualData(sampleDocumentos);
		}));

		it('$scope.findOne() should create an array with one Documento object fetched from XHR using a documentoId URL parameter', inject(function(Documentos) {
			// Define a sample Documento object
			var sampleDocumento = new Documentos({
				name: 'New Documento'
			});

			// Set the URL parameter
			$stateParams.documentoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/documentos\/([0-9a-fA-F]{24})$/).respond(sampleDocumento);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.documento).toEqualData(sampleDocumento);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Documentos) {
			// Create a sample Documento object
			var sampleDocumentoPostData = new Documentos({
				name: 'New Documento'
			});

			// Create a sample Documento response
			var sampleDocumentoResponse = new Documentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Documento'
			});

			// Fixture mock form input values
			scope.name = 'New Documento';

			// Set POST response
			$httpBackend.expectPOST('documentos', sampleDocumentoPostData).respond(sampleDocumentoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Documento was created
			expect($location.path()).toBe('/documentos/' + sampleDocumentoResponse._id);
		}));

		it('$scope.update() should update a valid Documento', inject(function(Documentos) {
			// Define a sample Documento put data
			var sampleDocumentoPutData = new Documentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Documento'
			});

			// Mock Documento in scope
			scope.documento = sampleDocumentoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/documentos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/documentos/' + sampleDocumentoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid documentoId and remove the Documento from the scope', inject(function(Documentos) {
			// Create new Documento object
			var sampleDocumento = new Documentos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Documentos array and include the Documento
			scope.documentos = [sampleDocumento];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/documentos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDocumento);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.documentos.length).toBe(0);
		}));
	});
}());