'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Historial Schema
 */
var HistorialSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	typemov : {
		type: String,
		trim : true,
		default : ''
	},
	icon : {
		type : String,
		trim : true,
		default : ''
	},
	url : {
		type : String,
		trim : true,
		default : ''
	},
	from : {
		type : String,
		trim : true,
		default : ''
	},
	documento : {
		_id : {
			type : Schema.ObjectId
		},
		name_document : {
			type: String ,
			trim: true
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
	},
	contacto : {
		_id : {
			type : Schema.ObjectId
		},
		razonSocial : {
			type: String,
			trim: true
		},
		thumbimage : {
			type : String ,
			trim : true
		},
		fullimage : {
			type : String ,
			trim : true
		},
		correo : {
			type: String,
			trim : true
		},
		address : {
			type: String,
			trim : true
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
		trim : true
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
		type : Boolean
	},
	birthday : {
		type : Date
	},
	updated : {
		type: Date
	},
	created: {
		type: Date
	},
	circles : [{
		idcircle : { type : Schema.ObjectId },
		name : { type : String },
		checked : { type : Boolean }
	}],
	tipocontacto : [ {
			type : String,
			trim : true,
			enum : ['Proveedor','Cliente', 'Prospecto']
	}],
	isprivate : {
		type : Boolean
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
	},
	usuario : {
		_id : {
			type : Schema.ObjectId
		},
		firstName : {
			type: String,
			trim: true
		},
		lastName : {
			type : String,
			trim : true
		},
		displayName : {
			type : String,
			trim : true
		},
		thumbimage : {
			type : String,
			trim : true
		},
		
		fullimage : {
			type : String ,
			trim : true
		},
		theme : {
			type : String,
			trim : true
		},
		username : {
			type: String,
			trim : true
		},
		password : {
			type: String
		},
		salt : {
			type: String
		},
		provider : {
			type: String
		},
		providerData : {},
		additionalProvidersData : {},
		roles : [{
			type: String,
			enum: ['admin', 'user', 'other']
		}],
		admin : [{
				type: String,
				trim : true,
				match: [/.+\@.+\..+/, 'Please fill a valid email address']
		}],
		groups : [ {
				type : String,
				trim : true,
				enum : ['Area Comercial','Factura', 'Ventas', 'Inventarios', 'Usuarios', 'Menus','Tickets', 'Calendario', 'Dashboard', 'Contactos' ]
		}],
		updated : {
			type: Date
		},
		circles : [{
			idcircle : { type : Schema.ObjectId },
			name : { type : String },
			checked : { type : Boolean}
		}],
		follwers : [{
			follower : {
				type : String,
				trim : true,
				match: [/.+\@.+\..+/, 'Please fill a valid email address']
			},
			added : {
				type : Date
			}
		}],
		created : {
			type : Date
		},
		rfc : {
			type : String,
			trim : true 
		},
		curp : {
			type : String,
			trim : true 
		},
		infonavit : {
			type : String
		},
		typeUser : {
			type : String
		},
		numEmpleado : {
			type : Number
		},
		workDays : [{
				type : String ,
				trim : true , 
				enum : ['lunes' , 'martes', 'miercoles' , 'jueves', 'viernes' , 'sabado' , 'domingo']
		}],
		workFunction : {
			type : String
		},
		title : {
			type : String
		},
		salary : {
			type : Number 
		},
		card : {
			type : String 
		},
		socialSecurity : {
			type : String
		},
		status : {
			type : Boolean
		},
		department : {
			type : String
		},
		contractDate : {
			type : Date
		},
		endContractDate : {
			type : Date
		},
		contractType : {
			type : String
		},
		telephons : [{
			telephone : {
				type : String,
				trim : true
			}
		}],
		permissions : {
			canCreate : { type : Boolean },
			canDelete : { type : Boolean },
			canUpdate : { type : Boolean }
		},
		/* For reset password */
		resetPasswordToken : {
			type : String
		},
	  	resetPasswordExpires : {
	  		type : Date
	  	}
	},
	calendario : {
		_id : {
			type : Schema.ObjectId
		},
		description: {
			type: String,
			trim: true
		},
		created: {
			type: Date
		},
		circles : [{
			idcircle : { type : Schema.ObjectId },
			name : { type : String },
			checked : { type : Boolean}
		}],
		idevent: {
			type : Schema.ObjectId
		},
		title: {
			type: String,
			trim: true
		},
		icon : {
			type: String,
			trim: true	
		},
		color :{
			type: String,
			trim: true
		},
		ispublic : {
			type : Boolean
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
			}
		}],
		user: {
			type: Schema.ObjectId
		}
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	active : {
		type : Boolean,
		default : true
	}
});


mongoose.model('Historial', HistorialSchema);