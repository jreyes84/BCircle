'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Circulo Schema
 */
var CirculoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Circulo name',
		trim: true,
		index : true ,
		unique: true 
	},
	description : {
		type : String,
		trim : true
	},
	created: {
		type: Date,
		default: Date.now
	},
	status:{
		type: Boolean,
		default : true
	},
	user: {
		type: Schema.ObjectId
	}
});

mongoose.model('Circulo', CirculoSchema);