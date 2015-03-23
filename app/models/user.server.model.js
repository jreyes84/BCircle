'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName : {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName : {
		type : String,
		trim : true,
		default : '',
		validate : [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName : {
		type : String,
		trim : true
	},
	thumbimage : {
		type : String ,
		default : 'img/placeholders/avatars/avatar.jpg',
		trim : true
	},	
	fullimage : {
		type : String ,
		default : 'img/placeholders/avatars/avatar@2x.jpg',
		trim : true
	},
	theme : {
		type : String,
		trim : true ,
		default : ''
	},
	username : {
		type: String,
		trim : true,
		unique: 'testing error message',
		required: 'Please fill in a username',
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid username']
	},
	password : {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt : {
		type: String
	},
	provider : {
		type: String,
		required: 'Provider is required'
	},
	providerData : {},
	additionalProvidersData : {},
	roles : [{
		type: String,
		enum: ['admin', 'user', 'other'],
		default: ['user']
	}],
	admin : [{
			type: String,
			trim : true,
			unique: 'testing error message',
			required: 'Please fill in a admin',
			default: '',
			validate: [validateLocalStrategyProperty, 'Please fill in your email'],
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
		checked : { type : Boolean, default : true }
	}],
	follwers : [{
		follower : {
			type : String,
			trim : true,
			required: 'Please fill in a username',
			default: '',
			validate: [validateLocalStrategyProperty, 'Please fill in your email'],
			match: [/.+\@.+\..+/, 'Please fill a valid email address']
		},
		added : {
			type : Date,
			default : Date.now
		}
	}],
	created : {
		type : Date,
		default : Date.now
	},
	rfc : {
		type : String,
		trim : true ,
		default: '' 
	},
	curp : {
		type : String,
		trim : true ,
		default: '' 
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
		type : Boolean ,
		default : true
	},
	department : {
		type : String
	},
	contractDate : {
		type : Date ,
		default : Date.now
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
		canCreate : { type : Boolean, default : false },
		canDelete : { type : Boolean, default : false },
		canUpdate : { type : Boolean, default : false }
	},
	/* For reset password */
	resetPasswordToken : {
		type : String
	},
  	resetPasswordExpires : {
  		type : Date
  	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length < 20) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);