'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Promocion = mongoose.model('Promocion'),
	_ = require('lodash');

/**
 * Create a Promocion
 */
exports.create = function(req, res) {
	var promocion = new Promocion(req.body);
	promocion.user = req.user;

	promocion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			res.jsonp(promocion);
		}
	});
};

/**
 * Show the current Promocion
 */
exports.read = function(req, res) {
	res.jsonp(req.promocion);
};

/**
 * Update a Promocion
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newArray = new Promocion({
		_id: req.body._id
	});
	
	newArray = _.extend(newArray , req.body);
	delete newArray.__v;

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
 * Delete an Promocion
 */
exports.delete = function(req, res) {
	var promocion = req.promocion ;

	promocion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(promocion);
		}
	});
};

/**
 * List of Promocions
 */
exports.list = function(req, res) { 
	Promocion.find().sort('-created').populate('combo.id').exec(function(err, promocions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(promocions);
		}
	});
};

exports.promotionById = function(req, res){
	Promocion.find({active:true}).sort('-start_date').populate('combo.id').exec(function(err, promocions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var now = new Date();
			var newResult = [];
			promocions.forEach(function(promotion){
				var start_date = new Date(promotion.start_date);
				var end_date = new Date(promotion.end_date);
				if(now >= start_date && now <= end_date){
					newResult.push(promotion);
				}
			});
			res.jsonp(newResult);
		}
	});	
};

/**
 * Promocion middleware
 */
exports.promocionByID = function(req, res, next, id) { Promocion.findById(id).populate('user', 'displayName').exec(function(err, promocion) {
		if (err) return next(err);
		if (! promocion) return next(new Error('Failed to load Promocion ' + id));
		req.promocion = promocion ;
		next();
	});
};

/**
 * Promocion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.promocion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};