'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cuenta Schema
 */
var CuentaSchema = new Schema({
	name : {
		type: String,
		trim: true
	},
	circles : [{
		idcircle : { type : Schema.ObjectId },
		name : { type : String },
		checked : { type : Boolean, default : true }
	}],
	order : { type : Number },	
	cuenta : [{
		name : {
			type: String,
			trim: true
		},
		circles : [{
			idcircle : { type : Schema.ObjectId },
			name : { type : String },
			checked : { type : Boolean, default : true }
		}],
		order : { type : Number },
		cantidad : { type : Number },
		subcuenta : [{
			name : {
				type: String,
				trim: true
			},
			circles : [{
				idcircle : { type : Schema.ObjectId },
				name : { type : String },
				checked : { type : Boolean, default : true }
			}],
			order : { type : Number },
			cantidad : { type : Number },
			detalle : [{
				cantidad : { type : Number },
				name : {
					type : String,
					trim : true
				},
				circles : [{
					idcircle : { type : Schema.ObjectId },
					name : { type : String },
					checked : { type : Boolean, default : true }
				}],
				order : { type : Number }
			}]			
		}]
	}],
	typecuenta : {
		type : String,
		trim : true,
		default : ''
	},
	cantidad : { type : Number, default: 0 },
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Cuenta', CuentaSchema);