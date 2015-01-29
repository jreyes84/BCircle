'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Nota Schema
 */
var NotaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Nota name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Nota', NotaSchema);