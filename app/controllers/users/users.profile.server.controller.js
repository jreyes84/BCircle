'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	fs = require('fs'),
	gm = require('gm'),
	im = require('imagemagick'),
	User = mongoose.model('User');


/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	if(req.body.theme!=='')
		user.theme = req.body.theme;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	//delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//var socketio = req.app.get('socketio');
				//socketio.sockets.emit('menu.assigned' , user);
				res.jsonp(user);
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
 * List of Articles
 */
exports.listMyusers = function(req, res) { 
	if(req.user){
		var email=[];
		var query = null;
		email.push(req.user.username);
		var role = [];
		role.push(req.user.roles);

		if(req.user.roles[0] === 'admin'){
			query = { $or: [ { admin: email }, { username: req.user.username } , {roles:role} ] };
		}else{
			query = { admin : email };
		}	
		User.find(query).sort('-created').populate('user', 'displayName').exec(function(err, users) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(users);
			}
		});
	}
};

exports.list = function(req, res){
	User.find({email : req.user.username}).sort('-created').populate('user', 'displayName').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

//upload avatar profile
exports.uploadAvatar = function(req, res, next){
	var oldPath = req.files.myFile.path;
    var separator = '/';
    var filename = oldPath.split(separator)[oldPath.split(separator).length-1];
    var split = filename.split('.');
    var name = req.body.userid + '@2x.' + split[1];
    var namethumb = req.body.userid + '.'+split[1];

    var newPath = ['./public', 'img', 'placeholders', 'avatars', name].join(separator);
    var newPathThumb = ['./public', 'img', 'placeholders', 'avatars',  namethumb].join(separator);

    fs.rename(oldPath, newPath, function (err) {
        if (err === null) {

            User.find({ _id : req.body.userid }).exec(function(err, users){
            	users[0].thumbimage = 'img/placeholders/avatars/'+namethumb;
            	users[0].fullimage = 'img/placeholders/avatars/'+name;
            	users[0].save(function(error){
	                im.resize({
					  srcPath: newPath,
					  dstPath: newPathThumb,
					  width:   64
					}, function(err, stdout, stderr){
					  return res.send(users);
					  
					});
	                
            	});
            });
        }
    });
};