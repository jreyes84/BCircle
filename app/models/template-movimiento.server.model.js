'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Template movimiento Schema
 */
var TemplateMovimientoSchema = new Schema({
	name : {
		type: String,
		trim: true
	},
	cuenta : [{
		name : { type : String },
		idcuenta : { type : Schema.ObjectId },
		descripcion : { type : String, trim	: true },
		cargo : { type : Boolean , default : false },
		abono : { type : Boolean , default : false },
		cargo_a : { type: String , default : '', trim : true },
		typeaccount : { type: String, default:'' }
	}],
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('TemplateMovimiento', TemplateMovimientoSchema);