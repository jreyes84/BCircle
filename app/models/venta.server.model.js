'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Venta Schema
 */
var VentaSchema = new Schema({
	productos:[{
		id_producto : { type : Schema.ObjectId, ref : 'Product'},
		cantidad : { type : Number },
		subtotal : { type : Number },
		id_promocion : { type : Schema.ObjectId, ref : 'Promocion'},
		created : { type : Date, default: Date.now }
	}],
	total: { type : Number },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Venta', VentaSchema);