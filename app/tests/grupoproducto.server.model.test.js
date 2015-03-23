'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grupoproducto = mongoose.model('Grupoproducto');

/**
 * Globals
 */
var user, grupoproducto;

/**
 * Unit tests
 */
describe('Grupoproducto Model Unit Tests:', function() {
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
			grupoproducto = new Grupoproducto({
				name: 'Grupoproducto Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return grupoproducto.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			grupoproducto.name = '';

			return grupoproducto.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Grupoproducto.remove().exec();
		User.remove().exec();

		done();
	});
});