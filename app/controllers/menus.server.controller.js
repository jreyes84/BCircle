'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Menu = mongoose.model('Menu'),
	_ = require('lodash');

/**
 * Create a Menu
 */
exports.create = function(req, res) {
	var menu = new Menu(req.body);
	menu.user = req.user;
	menu = _.extend(menu, req.body);
	menu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menu);
		}
	});
};

/**
 * Show the current Menu
 */
exports.read = function(req, res) {
	res.jsonp(req.menu);
};

/**
 * Update a Menu
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newMenu = new Menu({
		_id: req.body._id,
		icon: '',
		created: new Date(),
		children: [],
		status: '',
		order: '',
		url: '',
		description: '',
		name: ''
	});
	
	newMenu = _.extend(newMenu , req.body);
	delete newMenu.__v;
	newMenu.remove({__v: 0});
	console.log(newMenu);
	newMenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newMenu);
		}
	});
};

/**
 * Delete an Menu
 */
exports.delete = function(req, res) {
	var menu = req.menu ;

	menu.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menu);
		}
	});
};

/**
 * List of Menus
 */
exports.list = function(req, res) { Menu.find().sort('-created').populate('user', 'displayName').exec(function(err, menus) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menus);
		}
	});
};

exports.myMenulist = function(req, res) { 
	if(req.user){
		Menu.find().exec(function(errM, menu){
			if (errM) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(errM)
				});
			} else {
				if(menu.length < 1 ){
					//Insert menus default
					var newMenu = [];
					newMenu.push({ icon : 'gi gi-stopwatch sidebar-nav-icon', children : [ ], status : true, order : 1, url : '/', description : 'Dashboard', name : 'Dashboard' });
					newMenu.push({'icon' : 'fa fa-bookmark sidebar-nav-icon','children' : [ ],'status' : true,'order' : 3,'url' : 'menus/menulist',	'description' : 'Administracion de menus','name' : 'Menus'});
					newMenu.push({'icon' : 'hi hi-user sidebar-nav-icon',	'children' : [ ],'status' : true,'order' : 2,'url' : 'users/userslist',	'description' : 'Administracion de usuarios','name' : 'Usuarios'});
					newMenu.push({'icon' : 'hi hi-list-alt sidebar-nav-icon','children' : [	{'status' : true,'order' : 1,'url' : 'factura/odc','description' : 'Ordenes de Crédito','name' : 'ODC'},{'status' : true,'order' : 2,'url' : 'factura/edf','description' : 'Emisiones de facturas','name' : 'Emisión Factura'}],'status' : true,'order' : 4,'url' : '',	'description' : 'Administración de facturas','name' : 'Factura'});
					newMenu.push({'icon' : 'gi gi-parents sidebar-nav-icon','children' : [ ],	'status' : true,'order' : 5,'url' : 'contactos','description' : 'Administración de Contactos','name' : 'Contactos'});
					newMenu.push({'icon' : 'fa fa-calendar sidebar-nav-icon',	'children' : [ ],	'status' : true,	'order' : 5,'url' : 'calendars',	'description' : 'Eventos en el calendario',	'name' : 'Calendario'});
					newMenu.push({'icon' : 'fa fa-list sidebar-nav-icon',	'children' : [{'status' : true,	'order' : 1,'url' : 'cuentas','description' : 'Administra las cuentas del sistema',	'name' : 'Administrar cuentas'},{'status' : true,'order' : 2,'url' : 'template-movimientos','description' : 'Crea templates con tus cuentas','name' : 'Template movimientos'}],'status' : true,'order' : 2,'url' : '','description' : 'Administración de Cuentas','name' : 'Cuentas'});
					newMenu.push({'icon' : 'fa fa-book sidebar-nav-icon','children' : [ ],'status' : true,'order' : 2,'url' : 'documentos','description' : 'Administra los documentos','name' : 'Documentos'});
					newMenu.push({'icon' : 'fa fa-bar-chart-o sidebar-nav-icon','children' : [{'icon' : 'fa fa-bar-chart-o',	'status' : true,'order' : 1,'url' : 'rpts',	'description' : 'Reporte 1','name' : 'Reporte 1'}],'status' : true,'order' : 4,'url' : '','description' : 'Todos los reportes','name' : 'Reportes'});
					newMenu.push({'icon' : 'fa fa-dot-circle-o sidebar-nav-icon','children' : [ ],'status' : true,'order' : 5,'url' : 'circulos','description' : 'Agrega nuevos círculos','name' : 'Círculos'});
					newMenu.push({'icon' : 'fa fa-rss sidebar-nav-icon','children' : [ ],'status' : true,'order' : 9,'url' : 'historials','description' : 'Historial','name' : 'Historial'});
					newMenu.push({'icon': 'fa fa-shopping-cart sidebar-nav-icon','children': [{'icon': 'gi gi-cart_in sidebar-nav-icon','status': true,'order': 1,'url': 'products','description': '','name': 'Productos'},{ 'icon': 'gi gi-display sidebar-nav-icon', 'status': true,'order': 2,'url': 'punto_venta','description': '','name': 'Punto de venta'},{'status' : true,'order' : 3, 'url' : 'promocions', 'description' : '', 'name' : 'Promociones'}],'status': true,'order': 3,'url': '','description': '','name': 'Ventas'});
					
					newMenu.forEach(function(mnu){
						var menus = new Menu(mnu);
						menus.save();
					});
				}

				Menu.find({ name :{$in : req.user.groups}}).sort('order').exec(function(err, result) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(result);
					}
				});
			}		
		});
	}
};

/**
 * Menu middleware
 */
exports.menuByID = function(req, res, next, id) { Menu.findById(id).populate('user', 'displayName').exec(function(err, menu) {
		if (err) return next(err);
		if (! menu) return next(new Error('Failed to load Menu ' + id));
		req.menu = menu ;
		next();
	});
};

/**
 * Menu authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.menu.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};