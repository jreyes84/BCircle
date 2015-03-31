'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calendar Schema
 */
var CalendarSchema = new Schema({
	description: {
		type: String,
		trim: true
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
	idevent: {
		type : Schema.ObjectId
	},
	title: {
		type: String,
		required: 'Please fill Event Title',
		trim: true
	},
	icon : {
		type: String,
		trim: true	
	},
	color :{
		type: String,
		default: '',
		trim: true
	},
	ispublic : {
		type : Boolean,
		default : false
	},
	start : {
		type : Date
	},
	end: {
		type : Date
	},
	allDay : {
		type : Boolean
	},
	starttime : {
		type : String
	},
	endtime : {
		type : String
	},
	guests: [{
		idguest: { type : Schema.ObjectId },
		name : { type : String },
		thumbimage : { type : String },
		correo : { type : String } 
	}],
	location : {
		address 		: { type : String , trim : true},
		cp 				: { type : String , trim : true},
		longitude		: { type : String , trim : true},
		latitude		: { type : String , trim : true},
		country:{
			long_name	: { type : String , trim : true},
			short_name	: { type : String , trim : true}
		},
		state: {
			long_name	: { type : String , trim : true},
			short_name	: { type : String , trim : true}
		},
		locality:{
			long_name	: { type : String , trim : true},
			short_name	: { type : String , trim : true}
		}
	},
	isrepeat : { type : Boolean },
	repeat:{
		repeat_on : { 
			type : String,
			trim : true,
			enum : ['cada_dia','laborales','3_dias','2_dias','cada_semana', 'cada_mes', 'cada_ano']
		},
		every : { type: Number },
		when : { 
			type : Date
		},
		start : { type: Date },
		end : {
			never : { type: Boolean },
			after : { type: Number },
			when : { type : Date }
		},
		work_days : { 
			type : String,
			trim : true,
			enum : ['lunes','martes','miercoles','jueves','viernes']
		},
		m_t_f:{
			type : String,
			trim : true,
			enum : ['Lunes','miercoles','viernes']
		},
		every_week:{
			type : String,
			trim : true,
			enum : ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
		},
		resume : {
			type : String,
			trim : true
		}
	},
	notifications:[{
		type_not : {
			type: String,
			trim : true,
			enum : ['Correo','Sistema']
		},
		time : { type : Number},
		every : { 
			type: String,
			trim: true,
			enum : ['minutos','horas','días','semanas']
		},
		endtime : { type: String },
		sent : { type : Boolean, default:false }
	}],
	user: {
		type: Schema.ObjectId
	}
});

mongoose.model('Calendar', CalendarSchema);