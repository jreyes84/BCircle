'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Nota = mongoose.model('Nota'),
	_ = require('lodash');

/**
 * Create a Nota
 */
exports.create = function(req, res) {
	var nota = new Nota(req.body);
	nota.user = req.user;

	nota.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(nota);
		}
	});
};

/**
 * Show the current Nota
 */
exports.read = function(req, res) {
	res.jsonp(req.nota);
};

/**
 * Update a Nota
 */
exports.update = function(req, res) {
	var nota = req.nota ;

	nota = _.extend(nota , req.body);

	nota.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(nota);
		}
	});
};

/**
 * Delete an Nota
 */
exports.delete = function(req, res) {
	var nota = req.nota ;

	nota.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(nota);
		}
	});
};

/**
 * List of Notas
 */
exports.list = function(req, res) { Nota.find().sort('-created').populate('user', 'displayName').exec(function(err, notas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notas);
		}
	});
};

/**
 * Nota middleware
 */
exports.notaByID = function(req, res, next, id) { Nota.findById(id).populate('user', 'displayName').exec(function(err, nota) {
		if (err) return next(err);
		if (! nota) return next(new Error('Failed to load Nota ' + id));
		req.nota = nota ;
		next();
	});
};

/**
 * Nota authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.nota.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};