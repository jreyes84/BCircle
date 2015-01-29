'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	fs = require('fs'),
	Documento = mongoose.model('Documento'),
	Notificaciones = mongoose.model('Notificacione'),
	_ = require('lodash');

/**
 * Create a Documento
 */
exports.create = function(req, res) {
	var documento = new Documento(req.body);
	Documento.find({ name_document : documento.name_document}).exec(function(err, doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(doc.length>0){
				res.status(400).send({message: 'El documento '+documento.name_document + ' ya existe, intentelo con otro nombre'});
			}else{
				documento.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(documento);
					}
				});		
			}
		}
	});
};

/**
 * Show the current Documento
 */
exports.read = function(req, res) {
	res.jsonp(req.documento);
};

/**
 * Update a Documento
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newArray = new Documento({
		_id: req.body._id
	});
	
	newArray = _.extend(newArray , req.body);
	delete newArray.__v;
	newArray.remove({__v: 0});

	newArray.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newArray);
		}
	});
};

/**
 * Delete an Documento
 */
exports.delete = function(req, res) {
	var documento = req.documento ;

	documento.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(documento);
		}
	});
};

/**
 * List of Documentos
 */
exports.list = function(req, res) { 
	Documento.find().sort('-created').exec(function(err, documentos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(documentos);
		}
	});
};
/*
 * List of expirated Documents
 */
exports.listExpiratedDocuments = function(req, res){
	var user = req.user._id;
	Documento.find( { userCreated : user , date_end : { $gt : new Date(req.body.start), $lt : new Date(req.body.end)}, notificado : false } ).exec(function(err, documentos){
		if(err){
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		}else{
			documentos.forEach(function(doc){
				Notificaciones.find( { idProceso : doc._id } ).exec(function(errNoty, noty){
					if(errNoty){
						return res.status(400).send({
							message : errorHandler.getErrorMessage(errNoty)
						});		
					}else
					{
						if(noty.length === 0){
							var descrip = req.body.descripcion;
							descrip = descrip.replace('%DOC%',doc.name_document);
							var notificacion = new Notificaciones(
									  { title: req.body.title, 
										idProceso : doc._id, 
										descripcion : descrip,
										url : req.body.url,
										icon : req.body.icon,
										alertColor : req.body.alertColor,
										user: req.user._id });
							
							notificacion.save(function(errN,thisNoty){
								Notificaciones.find( { user : user , visto : false } ).exec(function(e,not){
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

									}
								});
							});
						}
					}
				});
				doc.notificado = true;
				doc.save();
			});			
			res.jsonp(documentos);
		}
	});
};

/**
 * Documento middleware
 */
exports.documentoByID = function(req, res, next, id) { 
	Documento.findById(id).populate('user', 'displayName').exec(function(err, documento) {
		if (err) 
			return next(err);
		if (! documento) 
			return next(new Error('Failed to load Documento ' + id));
		req.documento = documento ;
		next();
	});
};

/**
 * Documento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.documento.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

//upload avatar profile
exports.uploadFile = function(req, res, next){
	var oldPath = req.files.myFile.path;
    var separator = '/';
    var filename = oldPath.split(separator)[oldPath.split(separator).length-1];
    var split = filename.split('.');
    var name = req.body.userid + '.' + split[1];
    var newPath = ['./public', 'img', 'placeholders', 'documents', req.body.where , name].join(separator);

    fs.rename(oldPath, newPath, function (err) {
        if (err === null) {
            Documento.find({ _id : req.body.userid }).exec(function(err, documento){
            	documento[0][req.body.where] = 'img/placeholders/documents/'+req.body.where+'/'+name;
            	documento[0].save(function(error){
            		var paths = req.body.tempPath;
            		if( paths !== undefined )
            		{
            			fs.unlink(req.body.tempPath, function(){
            				return res.send(documento);	
            			});
            		}else{
            			return res.send(documento);
            		}            		
            	});
            });
        }
    });
};

exports.watchFile = function(req, res, next){
	var oldPath = req.files.myFile.path;
    var separator = '/';
    var filename = oldPath.split(separator)[oldPath.split(separator).length-1];
    var newPath = ['./public', 'img', 'placeholders', 'documents', 'temp' , filename].join(separator);

    fs.rename(oldPath, newPath, function (err) {
    	return res.send(newPath);	
    });	
};