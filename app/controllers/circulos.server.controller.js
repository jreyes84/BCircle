'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Circulo = mongoose.model('Circulo'),
	_ = require('lodash');

/**
 * Create a Circulo
 */
exports.create = function(req, res) {
	var circulo = new Circulo(req.body);
	circulo.user = req.user;

	circulo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(circulo);
		}
	});
};

/**
 * Show the current Circulo
 */
exports.read = function(req, res) {
	res.jsonp(req.circulo);
};

/**
 * Update a Circulo
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newArray = new Circulo({
		_id: req.body._id
	});
	
	newArray = _.extend(newArray , req.body);
	delete newArray.__v;
	newArray.remove({__v: 0});

	newArray.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newArray);
		}
	});
};

/**
 * Delete an Circulo
 */
exports.delete = function(req, res) {
	var circulo = req.circulo ;

	circulo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(circulo);
		}
	});
};

/**
 * List of Circulos
 */
exports.list = function(req, res) { Circulo.find().sort('created').exec(function(err, circulos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(circulos);
		}
	});
};

/**
 * Circulo middleware
 */
exports.circuloByID = function(req, res, next, id) { Circulo.findById(id).populate('user', 'displayName').exec(function(err, circulo) {
		if (err) return next(err);
		if (! circulo) return next(new Error('Failed to load Circulo ' + id));
		req.circulo = circulo ;
		next();
	});
};

/**
 * Circulo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.circulo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};