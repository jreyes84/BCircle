'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Grupoproducto = mongoose.model('Grupoproducto'),
	_ = require('lodash');

/**
 * Create a Grupoproducto
 */
exports.create = function(req, res) {
	var grupoproducto = new Grupoproducto(req.body);
	grupoproducto.user = req.user;

	grupoproducto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupoproducto);
		}
	});
};

/**
 * Show the current Grupoproducto
 */
exports.read = function(req, res) {
	res.jsonp(req.grupoproducto);
};

/**
 * Update a Grupoproducto
 */
exports.update = function(req, res) {
	var grupoproducto = req.grupoproducto ;

	grupoproducto = _.extend(grupoproducto , req.body);

	grupoproducto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupoproducto);
		}
	});
};

/**
 * Delete an Grupoproducto
 */
exports.delete = function(req, res) {
	var grupoproducto = req.grupoproducto ;

	grupoproducto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupoproducto);
		}
	});
};

/**
 * List of Grupoproductos
 */
exports.list = function(req, res) { Grupoproducto.find().sort('-created').populate('user', 'displayName').exec(function(err, grupoproductos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grupoproductos);
		}
	});
};

/**
 * Grupoproducto middleware
 */
exports.grupoproductoByID = function(req, res, next, id) { Grupoproducto.findById(id).populate('user', 'displayName').exec(function(err, grupoproducto) {
		if (err) return next(err);
		if (! grupoproducto) return next(new Error('Failed to load Grupoproducto ' + id));
		req.grupoproducto = grupoproducto ;
		next();
	});
};

/**
 * Grupoproducto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.grupoproducto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};