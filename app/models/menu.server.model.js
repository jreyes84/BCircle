'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Menu Schema
 */
var MenuSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Menu name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Menu description',
		trim: true
	},
	url: {
		type: String,
		default: '',
		trim: true
	},
	icon : {
		type : String,
		trim : true
	},
	
	order: {
		type: Number,
		default: 0
	},
	status : {
		type : Boolean,
		default : true
	},
	children: [{
		name: {
			type: String,
			default: '',
			required: 'Please fill Submenu name',
			trim: true
		},
		description: {
			type: String,
			default: '',
			required: 'Please fill Submenu description',
			trim: true
		},
		url: {
			type: String,
			default: '',
			required: 'Please fill Submenu url',
			trim: true
		},
		icon : {
			type : String,
			trim : true
		},
		order: {
			type: Number,
			default: 0
		},
		status : {
			type : Boolean,
			default : true
		},
		created: {
			type: Date,
			default: Date.now
		}
	}],
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Menu', MenuSchema);