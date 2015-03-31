'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	nodemailer = require('nodemailer'),
	config = require('../../config/config'),
	User = require('../models/user.server.model.js'),
	Calendar = require('../models/calendar.server.model.js'),
	Contacto = require('../models/contacto.server.model.js'),
	Notificaciones = require('../models/notificacione.server.model.js');

exports.setupJobs = function(app) {
	// Setup agenda
	var sampleJob = require('./system-schedule.js');

	// Setup agenda
	var Agenda = require('Agenda');
	var agenda = new Agenda({ db : { address : 'mongodb://admin:betoreyes@ds045011.mongolab.com:45011/heroku_app34087509'} } );
	// var agenda = new Agenda({ db : { address : 'localhost:27017/'} } );
	agenda.define('sendNotificactionFromCalendar', { priority: 'high', concurrency: 10 }, function(job, done) {
		console.log('every 5 seconds');
		var calendars = mongoose.model('Calendar');
		var todayStart = new Date();
		todayStart.setDate(todayStart.getDate() + 1);
		var	start = todayStart.getFullYear() + '-'+(todayStart.getMonth()+1)+'-01 00:00:00',
			end = todayStart.getFullYear() + '-'+(todayStart.getMonth()+1)+'-'+todayStart.getDate()+' 23:59:59';

		calendars.find({start : { $gte : new Date(start)}}, function(err,calendar){
			if(err){
				return done(err);
			}
			calendar.forEach(function(cal){
				cal.notifications.forEach(function(notis){
					var ok = false;
					if(!notis.sent){
						var dateCalendar = new Date(cal.start);
						if(notis.every==='días'){
							dateCalendar.setDate(dateCalendar.getDate() - notis.time );
						}else if(notis.every==='semanas'){
							dateCalendar.setDate(dateCalendar.getDate() - (notis.time*7) );
						}
						var today = new Date();

						if((today.getFullYear() + '-' + (today.getMonth()+1)+ '-' + today.getDate()) === (dateCalendar.getFullYear() + '-' + (dateCalendar.getMonth()+1 )+ '-' + dateCalendar.getDate())){
							ok = true;
						}
						if(ok){
							switch(notis.type_not){
								case 'Correo': 
									//sent the email to guests
									var arrayTo = cal.guests;
									var subject = cal.title;
									var to='';
									var html = '<div id="content" style="border: 1px solid #ccc;font-family: Sans-Serif;">' +
												'<table>' +
												'<tr>' +
													'<td colspan="2"><h3>"' + subject + '"</h3></td>' +
												'</tr>' +
												'<tr>' +
													'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Cuando</td>' +
													'<td class="texto">' + cal.repeat.resume + '</td>' +
												'</tr>' +
												'<tr>' +
													'<td class="etiqueta" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Calendario</td>' +
													'<td class="texto" style="font-family: Verdana; font-size: 9pt;">'+ cal.guests[0].name +'</td>' +
												'</tr>' +
												'<tr>' +
													'<td class="etiqueta" valign="top" style="color: #aaa;font-family: "MS Sans Serif", Geneva, sans-serif;font-size: 12pt;">Invitados</td>' +
													'<td valign="top">' +
														'<ul class="list" style="list-style: circle;font-size: 8pt;"> ';
															cal.guests.forEach(function(value){
																html +='<li>';
																if(value.name === cal.guests[0].name){
																		html += value.name + '<span style="color: #aaa;"> (organizador)</span>';
																}else{
																	html += value.name;
																}
																html += '</li>';
															});
														html += '</ul>' +
													'</td>' +
												'</tr>' +
											'</table>' +
										'</div>' ;
									notis.sent = true;
									cal.save();
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
											console.log('Enviado.');
										}else{
											console.log('Error');
										}
									});
								break; 
								case 'Sistema': 
								var Notificacion = mongoose.model('Notificacione');
								cal.guests.forEach(function(guestsUser){
									var notificacion = new Notificacion({ 
										title: cal.title, 
										descripcion : 'Evento próximo - '+cal.repeat.resume,
										url : 'calendars',
										icon : 'fa fa-calendar',
										alertColor : 'alert-danger',
										user: guestsUser 
									});
									notificacion.save(function(errN,thisNoty){
										Notificacion.find( { user : guestsUser , visto : false } ).exec(function(e,not){
											if(e){
												return errorHandler.getErrorMessage(e);
											}else{
												var socketio = app.get('socketio');
												socketio.sockets.emit('notify.newnotify' , thisNoty);
												var array = {
													total : not.length
												};
												socketio.sockets.emit('notify.totalNotifying' , array);
												notis.sent = true;
												cal.save();
											}
										});
									});
								});
								break;
							}
						}
					}
				});
			});
		});
	});
	
	var job = agenda.schedule('','sendNotificactionFromCalendar');
	job.repeatEvery('5 seconds');
	// job.run(function(err, job) {
 //  		console.log('I dont know why you would need to do this...');
	// });
	// job.save(function(err) {
	//   console.log('Job successfully saved');
	// });
	// var continusCalendar = agenda.schedule('in 5 seconds', 'sendNotificactionFromCalendar');
	// continusCalendar.repeatEvery('5 seconds');

	agenda.start();
	// agenda.schedule('in 3 seconds', 'show users');
	// agenda.every('5 seconds', 'send notificaction from calendar').save();
	// agenda.every('*/1 * * * *', 'show users');
	// agenda.start();
};