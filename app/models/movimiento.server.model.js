'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Movimiento Schema
 */
var MovimientoSchema = new Schema({
	idcuenta : {
		type: Schema.ObjectId
	},
	descripcion : {
		type: String,
		trim: true
	},
	cargo : {
		type : Boolean
	},
	abono : {
		type : Boolean
	},
	created : {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Movimiento', MovimientoSchema);