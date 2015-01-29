'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Movimiento = mongoose.model('Movimiento'),
	_ = require('lodash');

/**
 * Create a Movimiento
 */
exports.create = function(req, res) {
	var movimiento = new Movimiento(req.body);
	movimiento.user = req.user;

	movimiento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movimiento);
		}
	});
};

/**
 * Show the current Movimiento
 */
exports.read = function(req, res) {
	res.jsonp(req.movimiento);
};

/**
 * Update a Movimiento
 */
exports.update = function(req, res) {
	var movimiento = req.movimiento ;

	movimiento = _.extend(movimiento , req.body);

	movimiento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movimiento);
		}
	});
};

/**
 * Delete an Movimiento
 */
exports.delete = function(req, res) {
	var movimiento = req.movimiento ;

	movimiento.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movimiento);
		}
	});
};

/**
 * List of Movimientos
 */
exports.list = function(req, res) { Movimiento.find().sort('-created').populate('user', 'displayName').exec(function(err, movimientos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movimientos);
		}
	});
};

/**
 * Movimiento middleware
 */
exports.movimientoByID = function(req, res, next, id) { Movimiento.findById(id).populate('user', 'displayName').exec(function(err, movimiento) {
		if (err) return next(err);
		if (! movimiento) return next(new Error('Failed to load Movimiento ' + id));
		req.movimiento = movimiento ;
		next();
	});
};

/**
 * Movimiento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.movimiento.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};