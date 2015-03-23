'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var chats = require('../../app/controllers/chats');

	// Chats Routes
	app.route('/chats')
		.get(chats.list)
		.post(users.requiresLogin, chats.create)
		.put(chats.update);
	app.route('/chats/listUserSession').post(chats.listUserSession);
	app.route('/chats/getConversationChat').post(chats.getConversationChat);

	app.route('/chats/:chatId')
		.get(chats.read)
		.put(users.requiresLogin, chats.hasAuthorization, chats.update)
		.delete(users.requiresLogin, chats.hasAuthorization, chats.delete);

	// Finish by binding the Chat middleware
	app.param('chatId', chats.chatByID);
};