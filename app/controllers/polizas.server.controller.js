'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Poliza = mongoose.model('Poliza'),
	_ = require('lodash');

/**
 * Create a Poliza
 */
exports.create = function(req, res) {
	var poliza = new Poliza(req.body);
	poliza.user = req.user;

	poliza.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(poliza);
		}
	});
};

/**
 * Show the current Poliza
 */
exports.read = function(req, res) {
	res.jsonp(req.poliza);
};

/**
 * Update a Poliza
 */
exports.update = function(req, res) {
	var poliza = req.poliza ;

	poliza = _.extend(poliza , req.body);

	poliza.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(poliza);
		}
	});
};

/**
 * Delete an Poliza
 */
exports.delete = function(req, res) {
	var poliza = req.poliza ;

	poliza.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(poliza);
		}
	});
};

/**
 * List of Polizas
 */
exports.list = function(req, res) { Poliza.find().sort('-created').populate('user', 'displayName').exec(function(err, polizas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(polizas);
		}
	});
};

/**
 * Poliza middleware
 */
exports.polizaByID = function(req, res, next, id) { Poliza.findById(id).populate('user', 'displayName').exec(function(err, poliza) {
		if (err) return next(err);
		if (! poliza) return next(new Error('Failed to load Poliza ' + id));
		req.poliza = poliza ;
		next();
	});
};

/**
 * Poliza authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.poliza.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};