'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Historial = mongoose.model('Historial'),
	Documento = mongoose.model('Documento'),
	Contacto = mongoose.model('Contacto'),
	Calendar = mongoose.model('Calendar'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Historial
 */
exports.create = function(req, res) {
	var historial = new Historial(req.body);
	historial.user = req.user;
	var ObjectID = require('mongoose').Types.ObjectId;
	var id;	
	var ObjectId = new ObjectID(historial.documento._id);

	if(historial.documento._id)
	{
		ObjectId= new ObjectID(historial.documento._id);
		id = { 'documento._id': ObjectId };
	}else if(historial.contacto._id){
		ObjectId= new ObjectID(historial.documento._id);
		id = { 'contacto._id' : ObjectId };
	}else if(historial.calendario._id){
		ObjectId= new ObjectID(historial.documento._id);
		id = { 'calendario._id' : ObjectId };
	}else if(historial.usuario._id){
		ObjectId= new ObjectID(historial.documento._id);
		id = { 'usuario._id' : ObjectId };
	}

	Historial.find(id).exec(function(err, historials) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(historials.length>0)
			{
				historials.forEach(function(h){
					h.active = false;
					h.save();
				});
			}
			historial.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(historial);
				}
			});
		}
	});
};

/**
 * Show the current Historial
 */
exports.read = function(req, res) {
	//res.jsonp(req.historial);
};

/**
 * Update a Historial
 */
exports.update = function(req, res) {
	var historial = req.historial ;

	historial = _.extend(historial , req.body);

	historial.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(historial);
		}
	});
};

/**
 * Delete an Historial
 */
exports.delete = function(req, res) {
	var historial = req.historial ;

	historial.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(historial);
		}
	});
};

/**
 * List of Historials
 */
exports.list = function(req, res) { 
	Historial.find().sort('-created').exec(function(err, historials) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(historials);
			res.jsonp(historials);
		}
	});
};

exports.listById = function(req, res) {
	var param = req.body.param;
	var sort = req.body.sort;
	var obj ={};
	if(param.length > 0)
		obj = { active : true , $or : param  };

	Historial.find(obj).populate('user', 'displayName thumbimage')
					   .sort(sort).exec(function(err, historial) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//first fill contacts and users	
			res.jsonp(historial);
		}
	});
};

/**
 * Historial middleware
 */
exports.historialByID = function(req, res, next, id) { 
	Historial.findById(id).exec(function(err, historial) {
		if (err) return next(err);
		if (! historial) 
			return next(new Error('Failed to load Historial ' + id));
		
		req.historial = historial ;
		next();
	});
};

/**
 * Historial authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.historial.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};