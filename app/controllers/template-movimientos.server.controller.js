'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	TemplateMovimiento = mongoose.model('TemplateMovimiento'),
	Cuenta = mongoose.model('Cuenta'),
	_ = require('lodash');

/**
 * Create a Template movimiento
 */
exports.create = function(req, res) {
	var templateMovimiento = new TemplateMovimiento(req.body);
	templateMovimiento.user = req.user;

	templateMovimiento.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(templateMovimiento);
		}
	});
};

/**
 * Show the current Template movimiento
 */
exports.read = function(req, res) {
	res.jsonp(req.templateMovimiento);
};

/**
 * Update a Template movimiento
 */
exports.update = function(req, res) {
	if(req.body.eliminar){
		var body = req.body;
		TemplateMovimiento.find({},function(err, templateMovimiento) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				templateMovimiento.forEach(function(val){
					if(val._id+'' === body._id){
						val.remove();
						val.save();
					}
				});
			}
		});
	}else{
		var newArray;
		delete req.body.__v;
		newArray = new TemplateMovimiento({
			_id: req.body._id
		});
		
		newArray = _.extend(newArray , req.body);
		delete newArray.__v;
		newArray.remove({__v: 0});

		newArray.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(newArray);
			}
		});	
	}
};

/**
 * Delete an Template movimiento
 */
exports.delete = function(req, res) {
	var templateMovimiento = req.templateMovimiento ;

	templateMovimiento.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(templateMovimiento);
		}
	});
};

/**
 * List of Template movimientos
 */
exports.list = function(req, res) { 
	TemplateMovimiento.find().sort('-created').exec(function(err, templateMovimientos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(templateMovimientos);
		}
	});
};
/*
 * List Templates and cuentas
*/
exports.listTemplatesAndCuentas = function (req, res) {
	var all = [];
	var circles = req.body;

	var myFunction = function(circulos, cuenta){
		var finded = false;
		cuenta.circles.forEach(function(circleCuenta){
			if(!finded)
			{
				circulos.forEach(function(circulo){
					if(circleCuenta.name === circulo.name ){
						finded=true;
					}
				});
			}
		});
		return finded;
	};
	if(circles.length>0){
		TemplateMovimiento.find().sort('-created').exec(function(err, templateMovimientos) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				templateMovimientos.forEach(function(template){
					all.push( { id: template._id, text: template.name } );
				});
				Cuenta.find().sort('name').exec(function(err, cuentas) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						cuentas.forEach(function(tipo){						
							if(tipo.cuenta.length > 0){
								tipo.cuenta.forEach(function(cuenta){
									if(cuenta.subcuenta.length > 0){
										cuenta.subcuenta.forEach(function(subcuenta){
											if(subcuenta.detalle.length >0 ){
												subcuenta.detalle.forEach(function(detalle){
													if(myFunction(circles, detalle))
														all.push( { id : detalle._id , text : detalle.name });
												});	
											}else
											 {
											 	if(myFunction(circles, subcuenta))
											 		all.push( { id : subcuenta._id , text : subcuenta.name } );
											 }
										});	
									}else{
										if(myFunction(circles, cuenta))
											all.push( { id : cuenta._id , text : cuenta.name });
									}								
								});				
							}else{
								if(myFunction(circles, tipo))
									all.push( { id : tipo._id, text : tipo.name } );		
							}
						});
						res.jsonp(all);
					}
				});
			}
		});
	}else{
		res.jsonp([]);
	}
};


exports.listCuentasFromTemplates = function(req,res){
	var array = [];
	var param = req.body;
	//Function to verify if exists before push it to the array
	var checkIfExistBeforePushIt = function(param, array, account, typeaccount){
		var ok =true;
		param.forEach(function(value){
			if( value+'' === account._id+'' ){
				ok= true;
				//check if exist before then dont push it
				array.forEach(function(theArray){
					if(theArray.idcuenta+'' === account.id+''){
						ok = false;
						theArray.name = account.name;
						if(!theArray.circles)
							theArray.circles = [];
							theArray.circles = account.circles;
					}
				});
				if(ok)
					array.push( { idcuenta : account._id , name : account.name, cargo : false, abono: false , cargo_a: '', cargoQty : 0 , abonoQty : 0, edit : false, circles: account.circles, typeaccount:typeaccount } );
			}
		});
	};
	console.log(param);
	TemplateMovimiento.find( { _id : { $in : param } } ).exec(function(err, templates){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else
		{
			//Get templates
			//Get cuentas
			Cuenta.find().exec(function(err_1 , cuentas){

				if(err_1){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err_1)
					});
				}else{

					templates.forEach(function(count){
						count.cuenta.forEach(function(account){
							cuentas.forEach(function(tipo){
								if(account.idcuenta+'' === tipo._id+''){
									array.push( { idcuenta : tipo._id , name : tipo.name, cargo : account.cargo, abono: account.abono , cargo_a: account.cargo_a, cargoQty : 0 , abonoQty : 0, edit : false, circles: tipo.circles, typeaccount: tipo.typecuenta } );
								}else{
									tipo.cuenta.forEach(function(cuenta){
										if(account.idcuenta+'' === cuenta._id+''){
											array.push( { idcuenta : cuenta._id , name : cuenta.name, cargo : account.cargo, abono: account.abono , cargo_a: account.cargo_a, cargoQty : 0 , abonoQty : 0, edit : false, circles: cuenta.circles, typeaccount: tipo.typecuenta } );
										}else{
											cuenta.subcuenta.forEach(function(subcuenta){
												if(account.idcuenta+'' === subcuenta._id+''){
													array.push( { idcuenta : subcuenta._id , name : subcuenta.name, cargo : account.cargo, abono: account.abono , cargo_a: account.cargo_a, cargoQty : 0 , abonoQty : 0, edit : false, circles: subcuenta.circles, typeaccount: tipo.typecuenta } );
												}else{
													subcuenta.detalle.forEach(function(detalle){ //Get detalle
														if(account.idcuenta+'' === detalle._id+''){
															array.push( { idcuenta : detalle._id , name : detalle.name, cargo : account.cargo, abono: account.abono , cargo_a: account.cargo_a, cargoQty : 0 , abonoQty : 0, edit : false, circles: detalle.circles, typeaccount: tipo.typecuenta } );
														}
													});	
												}
											});
										}
									});				
								}								
							});
						});
					});

					cuentas.forEach(function(tipo){
						checkIfExistBeforePushIt(param, array, tipo, tipo.typecuenta); // call function

						tipo.cuenta.forEach(function(cuenta){
							checkIfExistBeforePushIt(param, array, cuenta, tipo.typecuenta); //call function

							cuenta.subcuenta.forEach(function(subcuenta){
								checkIfExistBeforePushIt(param, array, subcuenta, tipo.typecuenta);

								subcuenta.detalle.forEach(function(detalle){ //Get detalle
									checkIfExistBeforePushIt(param, array, detalle, tipo.typecuenta); //call function

								});	
							});
						});				
					});
					console.log(array);
					res.jsonp(array);
				}//else
			});
		}
	});
};

//
exports.listDetalle = function(req, res) { 
	Cuenta.find().sort('name').exec(function(err, cuentas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var newArray = [];
			cuentas.forEach(function(tipo){
				tipo.cuenta.forEach(function(cuenta){

					cuenta.subcuenta.forEach(function(subcuenta){
						if(subcuenta.detalle.length >0 ){
							subcuenta.detalle.forEach(function(detalle){
								newArray.push(detalle);
							});	
						}else
						 {
						 	newArray.push(subcuenta);
						 }
					});
				});				
				if(tipo.cuenta.length === 0 ){
					newArray.push(tipo);		
				}
			});
			res.jsonp(newArray);
		}
	});
};
/**
 * Template movimiento middleware
 */
exports.templateMovimientoByID = function(req, res, next, id) { TemplateMovimiento.findById(id).populate('user', 'displayName').exec(function(err, templateMovimiento) {
		if (err) return next(err);
		if (! templateMovimiento) return next(new Error('Failed to load Template movimiento ' + id));
		req.templateMovimiento = templateMovimiento ;
		next();
	});
};

/**
 * Template movimiento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.templateMovimiento.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};