'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Calendar = mongoose.model('Calendar'),
	Contacto = mongoose.model('Contacto'),
	nodemailer = require('nodemailer'),
	config = require('../../config/config'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Calendar
 */
exports.create = function(req, res) {
	var calendar = new Calendar(req.body);
	calendar.user = req.user;
	calendar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};
/**
 * Insert Masive events to Calendar
 */
exports.insertMassive = function(req, res) {
	var calendar = new Calendar(req.body);
	Calendar.create(req.body, function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			res.jsonp(calendar);
		}
	});
};

/**
 * Show the current Calendar
 */
exports.read = function(req, res) {
	res.jsonp(req.calendar);
};

/**
 * Update a Calendar
 */
exports.update = function(req, res) {
	console.log('update',req.body);
	Calendar.find({_id : req.body._id}).exec(function(err, calendar) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			calendar[0].guests.forEach(function(guest){
				guest.remove();
			});
			calendar[0].save(function(){
				console.log('Calendar:',calendar);	
				delete req.body.__v;
				var newArray = new Calendar({
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
			});
		}
	});
	
	// var socketio = req.app.get('socketio');
	// socketio.sockets.emit('notify.calendar');
	// socketio.sockets.emit('notify.calendar');
};

exports.sendEmailToUsers = function(req, res){
	var arrayTo = req.body[0].guests;
	var subject = req.body[0].subject;
	var to='';
	var html = req.body[0].html;
	var smtpTransport = nodemailer.createTransport(config.mailer.options);
	var length = arrayTo.length;
	var i = 0;
	arrayTo.forEach( function(email){
		if( i === length ){
			to += email.correo;	
		}else
		{
			to += email.correo+',';
		}	
		i++;
	});
	var mailOptions = {
		to: to,
		from: config.mailer.from,
		subject: subject,
		html: html
	};
	smtpTransport.sendMail(mailOptions, function(err) {
		if (!err) {
			res.send({
				message: 'An email has been sent to ' + to + ' with further instructions.'
			});
		}else{
			res.send({
				message: 'Error: ' + err
			});	
		}
	});	
};

/**
 * Delete an Calendar
 */
exports.delete = function(req, res) {
	var param = req.body;
	if(param.length !== undefined){
		Calendar.find({$or : param }).exec(function(err,calendar){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			
			calendar.forEach(function(theCalendar){
				theCalendar.remove();
			});
			res.jsonp(calendar);	
		});
	}else{
		Calendar.find(param).exec(function(err,calendar){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			calendar.forEach(function(theCalendar){
				theCalendar.remove();
			});			
			res.jsonp(calendar);
		});
	}
};

/**
 * List of Calendars
 */
exports.list = function(req, res) { 
	var newList = [];
	var start = req.body[0].start;
	var end = req.body[0].end;
	
	Calendar.find({ $or : [{ ispublic : true } , { user : req.user._id } , { 'guests.idguest' : req.user._id}], start : { $gt : new Date(start)} , end : { $lt : new Date(end)} }).exec(function(err, calendar) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};
/**
 * Get contacts and users
 */
 exports.listInvitations = function(req, res) { 
	var newList = [];
	Contacto.find({$or:[{ isprivate : false },{ user : req.user._id }]}).exec(function(err, contactos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			contactos.forEach(function(contact){
				newList.push({
					idguest : contact._id,
					name : contact.razonSocial,
					thumbimage : contact.thumbimage,
					correo : contact.correo,
					type : 'Contacto'
				});
			});
			User.find({}).exec(function(errU, users){
				users.forEach(function(user){
					newList.push({
						idguest : user._id,
						name : user.displayName,
						thumbimage : user.thumbimage,
						correo : user.username,
						type : 'Usuario'
					});	
				});
				res.jsonp(newList);
			});
		}
	});
};
/**
 * Calendar middleware
 */
exports.calendarByID = function(req, res, next, id) { Calendar.findById(id).populate('user', 'displayName').exec(function(err, calendar) {
		if (err) return next(err);
		if (! calendar) return next(new Error('Failed to load Calendar ' + id));
		req.calendar = calendar ;
		next();
	});
};

/**
 * Calendar authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.calendar.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};