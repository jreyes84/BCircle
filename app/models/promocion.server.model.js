'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Promocion Schema
 */
var PromocionSchema = new Schema({
	name: {
		type: String,
		required: 'Llene el campo nombre',
		unique : true,
		trim: true
	},
	combo : [{
			id : { type : Schema.ObjectId, ref : 'Product' }
	}],
	descuento : { type : Number, default: 0 },
	start_date : {
		type : Date
	},
	end_date:{
		type : Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	forzada : {
		type: Boolean,
		default : false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	active :{
		type : Boolean,
		default : true
	}
});

mongoose.model('Promocion', PromocionSchema);