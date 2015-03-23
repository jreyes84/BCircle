'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Configsystem = mongoose.model('Configsystem'),
	_ = require('lodash');

/**
 * Create a Configsystem
 */
exports.create = function(req, res) {
	var configsystem = new Configsystem(req.body);
	configsystem.user = req.user;

	configsystem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(configsystem);
		}
	});
};

/**
 * Show the current Configsystem
 */
exports.read = function(req, res) {
	res.jsonp(req.configsystem);
};

/**
 * Update a Configsystem
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newArray = new Configsystem({
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
 * Delete an Configsystem
 */
exports.delete = function(req, res) {
	var configsystem = req.configsystem ;

	configsystem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(configsystem);
		}
	});
};

/**
 * List of Configsystems
 */
exports.list = function(req, res) { 
	Configsystem.find().sort('-created').populate('puntoVentaTemplate').exec(function(err, configsystems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(configsystems);
		}
	});
};

/**
 * Configsystem middleware
 */
exports.configsystemByID = function(req, res, next, id) { Configsystem.findById(id).populate('user', 'displayName').exec(function(err, configsystem) {
		if (err) return next(err);
		if (! configsystem) return next(new Error('Failed to load Configsystem ' + id));
		req.configsystem = configsystem ;
		next();
	});
};

/**
 * Configsystem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.configsystem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};