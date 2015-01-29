'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Menu = mongoose.model('Menu'),
	_ = require('lodash');

/**
 * Create a Menu
 */
exports.create = function(req, res) {
	var menu = new Menu(req.body);
	menu.user = req.user;
	menu = _.extend(menu, req.body);
	menu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menu);
		}
	});
};

/**
 * Show the current Menu
 */
exports.read = function(req, res) {
	res.jsonp(req.menu);
};

/**
 * Update a Menu
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newMenu = new Menu({
		_id: req.body._id,
		icon: '',
		created: new Date(),
		children: [],
		status: '',
		order: '',
		url: '',
		description: '',
		name: ''
	});
	
	newMenu = _.extend(newMenu , req.body);
	delete newMenu.__v;
	newMenu.remove({__v: 0});
	console.log(newMenu);
	newMenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newMenu);
		}
	});
};

/**
 * Delete an Menu
 */
exports.delete = function(req, res) {
	var menu = req.menu ;

	menu.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menu);
		}
	});
};

/**
 * List of Menus
 */
exports.list = function(req, res) { Menu.find().sort('-created').populate('user', 'displayName').exec(function(err, menus) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menus);
		}
	});
};

exports.myMenulist = function(req, res) { 
	Menu.find({ name :{$in : req.user.groups}}).sort('order').exec(function(err, result) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(result);
		}
	});
};

/**
 * Menu middleware
 */
exports.menuByID = function(req, res, next, id) { Menu.findById(id).populate('user', 'displayName').exec(function(err, menu) {
		if (err) return next(err);
		if (! menu) return next(new Error('Failed to load Menu ' + id));
		req.menu = menu ;
		next();
	});
};

/**
 * Menu authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.menu.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};