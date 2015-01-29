'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cod postal Schema
 */
var CodPostalSchema = new Schema({
	d_codigo :{
		type : String,
		trim: true
	},
	d_asenta : {
		type : String,
		trim: true
	},
	d_tipo_asenta:{
		type : String,
		trim: true
	},
	D_mnpio:{
		type : String,
		trim: true
	},
	d_estado:{
		type : String,
		trim: true
	},
	d_ciudad:{
		type : String,
		trim: true
	},
	d_CP:{
		type : String,
		trim: true
	},
	c_estado:{
		type : String,
		trim: true
	},
	c_oficina:{
		type : String,
		trim: true
	},
	c_CP:{
		type : String,
		trim: true
	},
	c_tipo_asenta:{
		type : String,
		trim: true
	},
	c_mnpio:{
		type : String,
		trim: true
	},
	id_asenta_cpcons:{
		type : String,
		trim: true
	},
	d_zona:{
		type : String,
		trim: true
	},
	c_cve_ciudad:{
		type : String,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
	
});

mongoose.model('CodPostal', CodPostalSchema);