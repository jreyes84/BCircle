'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Session Schema
 */
var SessionSchema = new Schema({
    session: {
    	cookie : {
    		originalMaxAge: {type : Number },
    		expires: { type : Date},

    		httpOnly: { type : Boolean },
    		path: { type : String}
    	},
    	passport : { 
    		user: { type : Schema.ObjectId, ref: 'User' }
    	}
    },
    expires: { type : Date }
});

mongoose.model('Session', SessionSchema);