'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Documento Schema
 */
var DocumentoSchema = new Schema({
	name_document : {
		type: String ,
		index : true ,
		unique: true ,
		required: 'Please fill in document name',
		trim: true,
	},
	contacto : [{
		type : Schema.ObjectId
	}],
	circles : [{
		idcircle : { type : Schema.ObjectId },
		name : { type : String },
		checked : { type : Boolean, default : true }
	}],
	cuentas : [{
		name : { type : String },
		idcuenta : { type : Schema.ObjectId },
		cargo : { type : Boolean , default : false },
		abono : { type : Boolean , default : false },
		cargo_a : { type : String , default : '', trim : true },
		cargoQty : { type : Number }, 
		abonoQty : { type : Number },
		edit : { type : Boolean, default : false },
		circles : [{
			idcircle : { type : Schema.ObjectId },
			name : { type : String },
			checked : { type : Boolean, default : true }
		}],
		typeaccount : { type: String, default:'' }
	}],
	xml : {
		type : String,
		trim : true
	},
	pdf : {
		type : String,
		trim : true
	},
	date_document : {
		type: Date
	},
	created : {
		type: Date,
		default: Date.now
	},
	date_end : {
		type : Date
	},
	notificado : {
		type : Boolean,
		default : false
	},
	pay_type : {
		type : String,
		trim : true
	},
	document_type : {
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
		importe : { type : Number }
	}],
	totalImpuestosTrasladados : { type : Number },
	subtotal : { type : Number },
	descuento  : { type : Number },
	total : { type : Number },
	traslados : [{
		impuesto : { type : String },
		tasa : { type : Number },
		importe : { type : Number }

	}],
	userCreated: {
		type: Schema.ObjectId
	},
	userUpdated: [{
		id : { type: Schema.ObjectId  },
		date: { type : Date , default : Date.now }		
	}],
	isdelete: {type : Boolean, default : false }
});

mongoose.model('Documento', DocumentoSchema);