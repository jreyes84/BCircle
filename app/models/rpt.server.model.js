'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rpt Schema
 */
var RptSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Rpt name',
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

mongoose.model('Rpt', RptSchema);