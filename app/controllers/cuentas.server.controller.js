'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Cuenta = mongoose.model('Cuenta'),
	_ = require('lodash');

/**
 * Create a Cuenta
 */
exports.create = function(req, res) {
	var cuenta = new Cuenta(req.body);
	cuenta.user = req.user;

	cuenta.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Cuenta.find().sort('created').exec(function(err, cuentas){
				cuentas.forEach(function(value, key){
					value.order = key+1;
					value.save();
				});
				res.jsonp(cuenta);
			});
			
			
		}
	});
};

/**
 * Show the current Cuenta
 */
exports.read = function(req, res) {
	res.jsonp(req.cuenta);
};

/**
 * Update a Cuenta
 */
exports.update = function(req, res) {
	if(req.body.eliminar){
		var body = req.body;
		Cuenta.find().exec(function(err, cuentas) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				cuentas.forEach(function(val){
					if(val._id+'' === body._id){
						val.remove();
						val.save(function(result){
							Cuenta.find().sort('order').exec(function(err, tipo){
								tipo.forEach(function(value, key){
									value.order = key+1;
									value.cuenta.forEach(function(cuenta, kc){
										cuenta.order = kc+1;
										cuenta.subcuenta.forEach(function(subcuenta, ks){
											subcuenta.order = ks +1;
											subcuenta.detalle.forEach(function(detalle, kd){
												detalle.order = kd+1;
											});
										});
									});
									value.save();
								});	
								res.jsonp({});				
							});
						});
					}
				});
			}
		});
	}else{
		var newArray;
		delete req.body.__v;
		newArray = new Cuenta({
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
				Cuenta.find().sort('order').exec(function(err, tipo){
					if( tipo.length >0 ){
						tipo.forEach(function(value, key){
							value.order = key+1;
							value.cuenta.forEach(function(cuenta, kc){
								cuenta.order = kc+1;
								cuenta.subcuenta.forEach(function(subcuenta, ks){
									subcuenta.order = ks +1;
									subcuenta.detalle.forEach(function(detalle, kd){
										detalle.order = kd+1;
									});
								});
							});
							value.save();			
						});
					}
					res.jsonp(newArray);			
				});				
			}
		});	
	}
};

/**
 * Delete an Cuenta
 */
exports.delete = function(req, res) {
	var cuenta = req.cuenta ;

	cuenta.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cuenta);
		}
	});
};

/**
 * List of Cuentas
 */
exports.list = function(req, res) { Cuenta.find({}).sort('order').exec(function(err, cuentas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cuentas);
		}
	});
};

exports.listDetalle = function(req, res) { 
	Cuenta.find().sort('order').exec(function(err, cuentas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var newArray = [];
			cuentas.forEach(function(tipo){
				if(tipo.cuenta.length > 0){
					tipo.cuenta.forEach(function(cuenta){
						if(cuenta.subcuenta.length > 0){
							cuenta.subcuenta.forEach(function(subcuenta){
								if(subcuenta.detalle.length >0 ){
									subcuenta.detalle.forEach(function(detalle){
										newArray.push( { _id : detalle._id , name : detalle.name, order : detalle.order });
									});	
								}else
								 {
								 	newArray.push( { _id : subcuenta._id , name : subcuenta.name, order : subcuenta.order } );
								 }
							});	
						}else{
							newArray.push( { _id : cuenta._id , name : cuenta.name, order : cuenta.order });
						}								
					});				
				}else{
					newArray.push( { _id : tipo._id, name : tipo.name, order : tipo.order } );		
				}						
			});
			res.jsonp(newArray);
		}
	});
};

/**
 * Cuenta middleware
 */
exports.cuentaByID = function(req, res, next, id) { Cuenta.findById(id).populate('user', 'displayName').exec(function(err, cuenta) {
		if (err) return next(err);
		if (! cuenta) return next(new Error('Failed to load Cuenta ' + id));
		req.cuenta = cuenta ;
		next();
	});
};

/**
 * Cuenta authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cuenta.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};