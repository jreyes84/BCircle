'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Notificacione Schema
 */

var NotificacioneSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill title name',
		trim: true
	},
	idProceso : {
		type : Schema.ObjectId
	},
	descripcion : {
		type: String,
		default: '',
		required: 'Please fill descripcion',
		trim: true	
	},
	url : {
		type : String,
		trim: true
	},
	visto : {
		type : Boolean,
		default : false
	},
	icon : {
		type : String,
		trim: true
	},
	alertColor : {
		type : String,
		trim : true
	},
	watched : {
		type : Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId
	}
});

mongoose.model('Notificacione', NotificacioneSchema);