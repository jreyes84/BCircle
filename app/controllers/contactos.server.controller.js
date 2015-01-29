'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	fs = require('fs'),
	gm = require('gm'),
	im = require('imagemagick'),
	Contacto = mongoose.model('Contacto'),
	Notificaciones = mongoose.model('Notificacione'),
	_ = require('lodash');

/**
 * Create a Contacto
 */
exports.create = function(req, res) {
	var contacto = new Contacto(req.body);
	contacto.user = req.user;
	var notify = false;

	if(req.body.notify){
		notify = req.body.notify;
	}
	contacto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(notify){
				Notificaciones.find( { idProceso : contacto._id } ).exec(function(errNoty, noty){
					if(errNoty){
						return res.status(400).send({
							message : errorHandler.getErrorMessage(errNoty)
						});		
					}else
					{
						if(noty.length === 0){
							var descrip = 'Se agregó ' + contacto.razonSocial +' hace falta actualizarlo.';
							var notificacion = new Notificaciones(
									  { title: 'Alta de contacto', 
										idProceso : contacto._id, 
										descripcion : descrip,
										url : 'contactos',
										icon : 'gi gi-parents',
										alertColor : 'alert-danger',
										user: req.user._id });
							
							notificacion.save(function(errN,thisNoty){
								var user = req.user;
								Notificaciones.find( { user : user._id , visto : false } ).exec(function(e,not){
									if(e){
										return res.status(400).send({
											message : errorHandler.getErrorMessage(errNoty)
										});	
									}else{

										var socketio = req.app.get('socketio');
										socketio.sockets.emit('notify.newnotify' , thisNoty);
										var array = {
											total : not.length
										};

										socketio.sockets.emit('notify.totalNotifying' , array);
										res.jsonp(contacto);
									}
								});
							});
						}
					}
				});
			}else
			{
				res.jsonp(contacto);
			}
			
		}
	});
};

/**
 * Show the current Contacto
 */
exports.read = function(req, res) {
	res.jsonp(req.contacto);
};

/**
 * Update a Contacto
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newArray = new Contacto({
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
 * Delete an Contacto
 */
exports.delete = function(req, res) {
	Contacto.remove({_id:req.body._id}).exec(function(err,contacto){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contacto);
		}
	});
};

/**
 * List of Contactos
 */
exports.list = function(req, res) { 
	Contacto.find().sort('-created').exec(function(err, contactos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactos);
		}
	});
};

exports.listByParam = function(req, res){
	var param = req.body;
	var parameter;
	//console.log(req.body);
	switch(param.name){
				case 'razonSocial'     : parameter = { razonSocial : { $regex: param.value, $options: 'i' } }; break;
				case 'projects.name' : parameter = { 'projects.name': { $regex: param.value, $options: 'i' } }; break;
				case 'comercialName'      : parameter = { comercialName: { $regex: param.value, $options: 'i' } }; break;
				case 'tipocontacto'      : parameter = { tipocontacto : { $regex: param.value, $options: 'i' } }; break;
	}
	Contacto.find(parameter).sort('-created').exec(function(err, contactos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactos);
		}
	});
};

exports.findByFirstLastAndComercialName = function(req, res){
	var param = req.body;
	var parameter;
	parameter = {
		$or : [
			{ comercialName : { $regex : param.value , $options : 'i' } },
			{ lastName : { $regex : param.value , $options : 'i' } },
			{ firstName : { $regex : param.value , $options : 'i' } }
		]
	};

	Contacto.find(parameter).sort('comercialName').limit(6).exec(function(err,contactos){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactos);
		}
	});
};

exports.findById = function(req, res){
	var ids = req.body;
	Contacto.find({ _id : { $in : ids }}).exec(function(err, contacto){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contacto);
		}
	});
};

/**
 * Contacto middleware
 */
exports.contactoByID = function(req, res, next, id) { 
	Contacto.findById(id).exec(function(err, contacto) {
		if (err) return next(err);
		if (! contacto) return next(new Error('Failed to load Contacto ' + id));
		req.contacto = contacto ;
		next();
	});
};

/**
 * Contacto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.contacto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

//upload avatar profile
exports.uploadAvatar = function(req, res, next){
	var oldPath = req.files.myFile.path;
    var separator = '/';
    var filename = oldPath.split(separator)[oldPath.split(separator).length-1];
    var split = filename.split('.');
    var name = req.body.userid + '@2x.' + split[1];
    var namethumb = req.body.userid + '.'+split[1];

    var newPath = ['./public', 'img', 'placeholders', 'contacts', name].join(separator);
    var newPathThumb = ['./public', 'img', 'placeholders', 'contacts',  namethumb].join(separator);

    fs.rename(oldPath, newPath, function (err) {
        if (err === null) {
            Contacto.find({ _id : req.body.userid }).exec(function(err, contacto){
            	//console.log(contacto);
            	contacto[0].thumbimage = 'img/placeholders/contacts/'+namethumb;
            	contacto[0].fullimage = 'img/placeholders/contacts/'+name;
            	contacto[0].save(function(error){
	                im.resize({
					  srcPath: newPath,
					  dstPath: newPathThumb,
					  width:   64
					}, function(err, stdout, stderr){
					  return res.send(contacto);
					  
					});
	                
            	});
            });
        }
    });
};