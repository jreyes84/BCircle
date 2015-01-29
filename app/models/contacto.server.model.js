'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contacto Schema
 */
var ContactoSchema = new Schema({
	razonSocial : {
		type: String,
		trim: true,
		default: ''
	},
	thumbimage : {
		type : String ,
		default : '',
		trim : true
	},
	fullimage : {
		type : String ,
		default : '',
		trim : true
	},
	correo : {
		type: String,
		trim : true,
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	address : {
		type: String,
		trim : true,
		default: '',
	},
	cp : {
		type: String,
		trim : true
	},
	colonia : [{
		name : {
			type: String,
			trim : true
		}
	}],
	ciudad : {
		type: String,
		trim : true
	},
	estado : {
		type: String,
		trim : true
	},
	country : {
		type: String,
		trim : true
	},
	comercialName : {
		type: String,
		trim : true,
		default : ''
	},
	rfc :{
		type: String,
		trim : true,
		uppercase : true
	},
	webPage : {
		type: String,
		trim : true
	},
	rating : {
		type: String,
		trim : true
	},
	functions : [{
		name : {
			type: String,
			trim : true	
		}		
	}],
	telephons : [{
		telephone : {
			type : String,
			trim : true
		}
	}],
	status : {
		type : Boolean,
		default : true
	},
	birthday : {
		type : Date
	},
	updated : {
		type: Date ,
		default : ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	circles : [{
		idcircle : { type : Schema.ObjectId },
		name : { type : String },
		checked : { type : Boolean, default : true }
	}],
	tipocontacto : [ {
			type : String,
			trim : true,
			enum : ['Proveedor','Cliente', 'Prospecto']
	}],
	isprivate : {
		type : Boolean,
		default : false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Contacto', ContactoSchema);