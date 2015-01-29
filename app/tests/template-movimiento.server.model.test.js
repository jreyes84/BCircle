'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	TemplateMovimiento = mongoose.model('TemplateMovimiento');

/**
 * Globals
 */
var user, templateMovimiento;

/**
 * Unit tests
 */
describe('Template movimiento Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			templateMovimiento = new TemplateMovimiento({
				name: 'Template movimiento Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return templateMovimiento.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			templateMovimiento.name = '';

			return templateMovimiento.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		TemplateMovimiento.remove().exec();
		User.remove().exec();

		done();
	});
});