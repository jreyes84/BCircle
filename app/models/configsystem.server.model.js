'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Configsystem Schema
 */
var ConfigsystemSchema = new Schema({
	companyName: {
		type: String,
		default: '',
		trim: true
	},
	puntoVentaTemplate : [{
		id_template : {
			type : Schema.ObjectId,
			ref : 'TemplateMovimiento'
		}
	}],
	logoThumb : { 
		type: String, 
		default: 'img/placeholders/logo/avatar.jpg' 
	},
	logoFull : { 
		type: String,
		default: 'img/placeholders/logo/avatar@2x.jpg' 
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Configsystem', ConfigsystemSchema);