'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),

	nodemailer = require('nodemailer'),
	config = require('../../config/config'),
	Calendar = require('../models/calendar.server.model.js'),
	Contacto = require('../models/contacto.server.model.js'),
	User = require('../models/user.server.model.js'),
	_ = require('lodash');

/**
 * Create a Calendar
 */
exports.showMessage = function( agenda ) {
	agenda.define('show message', function(job, done){
		var calendars = mongoose.model('Calendar');
		var todayStart = new Date(),
			start = todayStart.getFullYear() + '-'+todayStart.getMonth()+'-'+todayStart.getDate()+' 00:00:00',
			end = todayStart.getFullYear() + '-'+todayStart.getMonth()+'-'+todayStart.getDate()+' 23:59:59';
		console.log(start, end);
		calendars.find({start : { $gte : new Date(start)} , end : { $lte : new Date(end)}}, function(err,calendar){
			if(err){
				return done(err);
			}

			console.log(calendar);
		});
		done();
	});
};