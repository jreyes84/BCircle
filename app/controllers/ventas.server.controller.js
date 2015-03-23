'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Venta = mongoose.model('Venta'),
	_ = require('lodash');

/**
 * Create a Venta
 */
exports.create = function(req, res) {
	var venta = new Venta(req.body);
	venta.user = req.user;

	venta.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(venta);
		}
	});
};

/**
 * Show the current Venta
 */
exports.read = function(req, res) {
	res.jsonp(req.venta);
};

/**
 * Update a Venta
 */
exports.update = function(req, res) {
	var venta = req.venta ;

	venta = _.extend(venta , req.body);

	venta.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(venta);
		}
	});
};

/**
 * Delete an Venta
 */
exports.delete = function(req, res) {
	var venta = req.venta ;

	venta.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(venta);
		}
	});
};

/**
 * List of Ventas
 */
exports.list = function(req, res) { Venta.find().sort('-created').populate('user', 'displayName').exec(function(err, ventas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ventas);
		}
	});
};

/**
 * Venta middleware
 */
exports.ventaByID = function(req, res, next, id) { Venta.findById(id).populate('user', 'displayName').exec(function(err, venta) {
		if (err) return next(err);
		if (! venta) return next(new Error('Failed to load Venta ' + id));
		req.venta = venta ;
		next();
	});
};

/**
 * Venta authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.venta.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};