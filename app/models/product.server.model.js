'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	name: {
		type: String,
		index : true ,
		trim: true
	},
	name_document :{
		type : String
	},
	descripcion: {
		type: String,
		index : true ,
		trim: true
	},
	code_bar: {
		type: String,
		trim: true
	},
	upc:{
		type : String,
		trim:true
	},
	thumbimage : {
		type: String,
		default: 'img/placeholders/avatars/avatar1@2x.jpg',
		trim: true
	},
	fullimage: {
		type: String,
		default: 'img/placeholders/avatars/avatar1.jpg',
		trim: true
	},
	stock_min: {
		type: Number,
		trim: true,
		default : 0
	},
	stock_max: {
		type: Number,
		trim: true,
		default : 0
	},
	stock_actual: {
		type: Number,
		trim: true,
		default : 0
	},
	no_series : [{
		name:{
			type: String,
			trim : true
		}
	}],
	precio_compra: [{
		precio : { type: Number, trim: true, default : 0 },
		id_proveedor : { type: Schema.ObjectId, ref: 'Contacto' }
	}],
	precio_venta : [{
		precio : { type: Number, trim: true, default : 0 },
		proveedor : [{
			id_proveedor : { type: Schema.ObjectId, ref: 'Contacto'},
			active : { type : Boolean , default : true }
		}]
	}],
	stock_notification_limit : {
		sent : {
			type : Boolean,
			default : false
		},
		date : { 
			type : Date,
			default : Date.now
		}
	},
	active: {
		type: Boolean,
		default: true
	},
	status : {
		type : String,
		trim : true,
		default : 'No recibido',
		enum : ['No recibido','Recibido','Defectuoso']
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Product', ProductSchema);