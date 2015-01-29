'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	CodPostal = mongoose.model('CodPostal'),
	_ = require('lodash');

/**
 * Create a Cod postal
 */
exports.create = function(req, res) {
	var codPostal = new CodPostal(req.body);
	codPostal.user = req.user;

	codPostal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(codPostal);
		}
	});
};

/**
 * Show the current Cod postal
 */
exports.read = function(req, res) {
	res.jsonp(req.codPostal);
};

/**
 * Update a Cod postal
 */
exports.update = function(req, res) {
	var codPostal = req.codPostal ;

	codPostal = _.extend(codPostal , req.body);

	codPostal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(codPostal);
		}
	});
};

/**
 * Delete an Cod postal
 */
exports.delete = function(req, res) {
	var codPostal = req.codPostal ;

	codPostal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(codPostal);
		}
	});
};

/**
 * List of Cod postals
 */
exports.list = function(req, res) { 
	CodPostal.find().sort('-created').populate('user', 'displayName').exec(function(err, codPostals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(codPostals);
		}
	});
};
exports.findByCP = function( req, res ){
	CodPostal.find({ d_codigo:req.body.cp }).exec(function(err, codPostals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(codPostals);
		}
	});
};
/**
 * Cod postal middleware
 */

exports.codPostalByID = function(req, res, next, id) { CodPostal.findById(id).populate('user', 'displayName').exec(function(err, codPostal) {
		if (err) return next(err);
		if (! codPostal) return next(new Error('Failed to load Cod postal ' + id));
		req.codPostal = codPostal ;
		next();
	});
};

/**
 * Cod postal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.codPostal.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};