'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grupoproducto Schema
 */
var GrupoproductoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Grupo producto',
		trim: true,
		index : true ,
		unique: true 
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

mongoose.model('Grupoproducto', GrupoproductoSchema);