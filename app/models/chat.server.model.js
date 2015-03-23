'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Chat Schema
 */
var ChatSchema = new Schema({
	nameChatRoom : { type : String },
	users_allow : [{ 
		user : { type : Schema.ObjectId, ref :'User' }
	}],
	admin : { type : Schema.ObjectId, ref :'User' },
	individualChatUsers:[{
		user : { type : Schema.ObjectId, ref: 'User' }
	}],
	chat : [{
		userWrote : { type : Schema.ObjectId, ref :'User' },
		userToSee : { type : Schema.ObjectId, ref :'User' },
		text : { type : String, trim: true }, 
		saw : { type : Boolean }, 
		saw_date : { type : Date },
		created: { type: Date, default: Date.now }
	}]
});

mongoose.model('Chat', ChatSchema);