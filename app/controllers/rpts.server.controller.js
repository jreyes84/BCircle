'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Rpt = mongoose.model('Rpt'),
	Documento = mongoose.model('Documento'),
	fs = require('fs'),
	Cuenta = mongoose.model('Cuenta'),
	Contacto = mongoose.model('Contacto'),
	_ = require('lodash');

/**
 * Create a Rpt
 */
exports.create = function(req, res) {
	var rpt = new Rpt(req.body);
	rpt.user = req.user;

	rpt.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rpt);
		}
	});
};

/**
 * Show the current Rpt
 */
exports.read = function(req, res) {
	res.jsonp(req.rpt);
};

/**
 * Update a Rpt
 */
exports.update = function(req, res) {
	var rpt = req.rpt ;

	rpt = _.extend(rpt , req.body);

	rpt.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rpt);
		}
	});
};

/**
 * Delete an Rpt
 */
exports.delete = function(req, res) {
	var rpt = req.rpt ;

	rpt.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rpt);
		}
	});
};

/**
 * List of Rpts
 */
exports.list = function(req, res) { Rpt.find().sort('-created').populate('user', 'displayName').exec(function(err, rpts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rpts);
		}
	});
};

/*
 *Rpt 1
 */

exports.reporte_1 = function(req, res){
	var values = req.body.cuentasSelected;
	var start = req.body.start;
	var end = req.body.end;
	var parameters = {};

	if(values.length>0){
		parameters['cuentas.idcuenta'] = { $in : values };
	}
	if(start)
	{
		parameters.date_document = { $gt : new Date(start), $lt : new Date(end)};
	}
	Documento.find( parameters , { cuentas : 1 , _id : 0 , name_document : 1 , date_document : 1 , contacto:1 } ).sort('name').exec(function(err, rpts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rpts);
		}
	});
};

exports.balanceGeneral = function( req, res ){
	var values = req.body.cuentasSelected;
	var start = req.body.start;
	var end = req.body.end;
	var parameters = {};

	if(values.length>0){
		parameters['cuentas.idcuenta'] = { $in : values };
	}

	if(start !== undefined){
		Documento.aggregate([{ $match : { date_document: { $gt : new Date( start ), $lt : new Date( end ) } } } ,{ $unwind : '$cuentas' }, { $project : { cuentas : 1, name : '$cuentas.name',idcuenta: '$cuentas.idcuenta' } }, { $group: { _id: { idcuenta:'$idcuenta', name: '$name' }, cargo: {$sum:'$cuentas.cargoQty' } , abono: {$sum:'$cuentas.abonoQty' } }} ]).exec(function(err,result){
			console.log('With date');
			res.jsonp(result);
		});
	}else{
		Documento.aggregate([{ $unwind : '$cuentas' }, { $project : { cuentas:1, name : '$cuentas.name',idcuenta: '$cuentas.idcuenta' } }, { $group: { _id: { idcuenta:'$idcuenta', name: '$name' }, cargo: {$sum:'$cuentas.cargoQty' } , abono: {$sum:'$cuentas.abonoQty' } }} ]).exec(function(err,result){
			console.log('Wihtout date');
			res.jsonp(result);
		});
	}
};

/**
 *Export to .CSV
 */

 exports.exportToCsv = function(req, res){
 	var datas = req.body.data;
 	var fields = req.body.fields;
 	var params = req.body.params;
 	var header = req.body.header;
 	var nameFile = req.body.nameFile;
 	var delimiter = ',';
 	var result='';

 	if(req.body.delimiter !== undefined)
 		delimiter = req.body.delimiter;

 	header.forEach(function(head){
 		result += head+delimiter;
 	});
 	result += '\n';
 	var cargo = 0;
 	var abono = 0;

 	//This is for Ignis Report.
 	datas.forEach(function(data){
 		fields.forEach(function(field){
 			console.log(field,typeof data[field]);
 			if(typeof data[field] === 'string'){
 				result += '"' + data[field] +'"' + delimiter;
 			}else if( typeof data[field] === 'number' ){
 				if(field === 'cargoQty')
 					cargo += data[field];
 				if(field === 'abonoQty')
 					abono += data[field];
 				result += data[field] + delimiter;
 			}else if(typeof data[field] === 'undefined'){
 				if(field === 'cargoQty')
 					result += 0 + delimiter;
 				else if(field === 'abonoQty')
 					result += 0 + delimiter;
 				else
 					result += ',';
 			}
 		});
 		result += '\n';
 	});
 		result += ',,Total,'+cargo+','+abono+'\n';

	fs.writeFile('public/img/placeholders/documents/exports/csv/'+nameFile+'.csv', result, function(err) {
		if (err) throw err;
		res.jsonp({
			ok: 'Archivo generado' , 
			rootFile : '/img/placeholders/documents/exports/csv/'+nameFile+'.csv'
		});
	});

 };

/**
 * Rpt middleware
 */
exports.rptByID = function(req, res, next, id) { Rpt.findById(id).populate('user', 'displayName').exec(function(err, rpt) {
		if (err) return next(err);
		if (! rpt) return next(new Error('Failed to load Rpt ' + id));
		req.rpt = rpt ;
		next();
	});
};

/**
 * Rpt authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rpt.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};