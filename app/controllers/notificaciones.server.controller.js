'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Users = mongoose.model('User'),
	Notificacione = mongoose.model('Notificacione'),
	_ = require('lodash');

/**
 * Create a Notificacione
 */
exports.create = function(req, res) {
	var notificacione = new Notificacione(req.body);
	notificacione.user = req.user;

	notificacione.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notificacione);
		}
	});
};

/**
 * Show the current Notificacione
 */
exports.read = function(req, res) {
	res.jsonp(req.notificacione);
};

/**
 * Update a Notificacione
 */
exports.update = function(req, res) {
	var notificacione = req.notificacione ;

	notificacione = _.extend(notificacione , req.body);

	notificacione.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notificacione);
		}
	});
};

/**
 * Delete an Notificacione
 */
exports.delete = function(req, res) {
	var notificacione = req.notificacione ;

	notificacione.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notificacione);
		}
	});
};

/**
 * List of Notificaciones
 */
exports.list = function(req, res) { 
	Notificacione.find({ user : req.user._id , visto : false }).sort('created').exec(function(err, notificaciones) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var array = {
				total : notificaciones.length
			};

			var socketio = req.app.get('socketio');
			socketio.sockets.emit('notify.totalNotifying' , array);
			
			res.jsonp(notificaciones);
		}
	});
};
/**
 *Notificaciones Has Been Seen
 */
exports.thisNotyHasBeenSeen = function(req, res){
	Notificacione.find({ _id : req.body._id }).exec( function( err , notificacion ){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			notificacion.forEach(function(doc){
				doc.visto = true;
				doc.save(function(errD,doct){
					if(errD)
					{
						return res.status(400).send({
							message: errorHandler.getErrorMessage(errD)
						});
					}else{
						var array = {
							total : -1
						};
						 var socketio = req.app.get('socketio');
						 socketio.sockets.emit('notify.totalNotifying' , array);

						res.jsonp(doct);
					}
				});
			});
		}
	});
};

/**
 * Notificacione middleware
 */
exports.notificacioneByID = function(req, res, next, id) { Notificacione.findById(id).populate('user', 'displayName').exec(function(err, notificacione) {
		if (err) return next(err);
		if (! notificacione) return next(new Error('Failed to load Notificacione ' + id));
		req.notificacione = notificacione ;
		next();
	});
};

/**
 * Notificacione authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.notificacione.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};