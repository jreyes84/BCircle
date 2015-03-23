'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Chat = mongoose.model('Chat'),
	Session = mongoose.model('Session'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Chat
 */
exports.create = function(req, res) {
	var chat = new Chat(req.body);
	chat.user = req.user;
	console.log(chat);
	chat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('chat.reciveMessage' , { 
				_id : chat._id,
				userWrote : req.body.chat[0].userWrote,
				userToSee : req.body.chat[0].userToSee,
				text : req.body.chat[0].text
			});
			res.jsonp(chat);
		}
	});
};

/**
 * Show the current Chat
 */
exports.read = function(req, res) {
	res.jsonp(req.chat);
};

/**
 * Update a Chat
 */
exports.update = function(req, res) {
	// var chat = req.chat ;

	// chat = _.extend(chat , req.body);

	// chat.save(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(chat);
	// 	}
	// });

	delete req.body.__v;
	var newArray = new Chat({
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
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('chat.reciveMessage' , { 
				_id : req.body._id,
				userWrote : req.body.chat[req.body.chat.length-1].userWrote,
				userToSee : req.body.chat[req.body.chat.length-1].userToSee,
				text : req.body.chat[req.body.chat.length-1].text
			});
			res.jsonp(newArray);
		}
	});
};

/**
 * Delete an Chat
 */
exports.delete = function(req, res) {
	var chat = req.chat ;

	chat.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chat);
		}
	});
};

/**
 * List of Chats
 */
exports.list = function(req, res) { Chat.find().sort('-created').populate('user', 'displayName').exec(function(err, chats) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(chats);
		}
	});
};

// exports.

exports.listUserSession = function(req, res){
	req.session.destroy();
	setTimeout(function() {
		Session.find().exec(function(err, sessions){
			if(err){
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}else{
				var usersSession =[];
				sessions.forEach(function(session){
					var str = session.session.toString().replace('/','').replace(/'/g,'');
					var obj = JSON.parse(str);
					if(obj.passport.user){
						usersSession.push(obj.passport.user);	
					}
				});
				
				User.find({_id : { $in : usersSession }}).exec(function(errUser, users){
					if(errUser){
						return res.status(400).sed({
							message: errorHandler.getErrorMessage(errUser)
						});
					}else{
						var socketio = req.app.get('socketio');
						socketio.sockets.emit('notify.chatusersconnected' , users);
						res.jsonp(users);
					}
				});
			}
		});
	}, 3000);
};

exports.getConversationChat = function(req, res){
	Chat.find({ $and : [ {'individualChatUsers.user': req.body.from},{'individualChatUsers.user': req.body.to}]}).exec(function(err, chat){
		if(err){
			return res.status(400).send({
				message : errorHandler.getErrorMessage(err)
			});
		}else{
			res.jsonp(chat);
		}
	});
};

/**
 * Chat middleware
 */
exports.chatByID = function(req, res, next, id) { Chat.findById(id).populate('user', 'displayName').exec(function(err, chat) {
		if (err) return next(err);
		if (! chat) return next(new Error('Failed to load Chat ' + id));
		req.chat = chat ;
		next();
	});
};

/**
 * Chat authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.chat.user._id !== req.user._id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};