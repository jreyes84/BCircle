'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Poliza Schema
 */
var PolizaSchema = new Schema({
	name_poliza : {
		type: String ,
		default: '' ,
		unique: 'testing error message' ,
		required: 'Please fill Poliza name',
		trim: true,
	},
	contacto : [{
		type : Schema.ObjectId
	}],
	cuentas : [{
		type : Schema.ObjectId
	}],
	created : {
		type: Date,
		default: Date.now
	},
	date_end : {
		type : Date
	},
	pay_type : {
		type : String,
		trim : true
	},
	poliza_type : {
		type : String
	},
	impuesto : {
		type : Number
	},
	retencion : {
		type : Number
	},
	items : [{
		cantidad : {type : Number},
		cod_fabricante : {type : String },
		descripcion : { type: String },
		no_serie : { type : String },
		precio : { type : Number },
		subtotal : { type : Number },
		impuesto : { type : Number },
		total_impuesto : { type : Number },
		total : { type : Number }
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Poliza', PolizaSchema);