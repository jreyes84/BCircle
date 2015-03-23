'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	fs = require('fs'),
	gm = require('gm'),
	im = require('imagemagick'),
	Product = mongoose.model('Product'),
	_ = require('lodash');

/**
 * Create a Product
 */
exports.create = function(req, res) {
	var product = new Product(req.body);
	product.user = req.user;

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * Insert Masive events to Calendar
 */
exports.insertMassive = function(req, res) {
	var product = new Product(req.body);
	Product.create(req.body, function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			res.jsonp(product);
		}
	});
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
	res.jsonp(req.product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
	delete req.body.__v;
	var newArray = new Product({
		_id: req.body._id
	});
	
	newArray = _.extend(newArray , req.body);
	delete newArray.__v;
	newArray.remove({__v: 0});

	newArray.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newArray);
		}
	});
};

/**
 * Update a Product
 */
exports.updateMassive = function(req, res) {
	var ids= [];
	
	for (var i=0 ;i<req.body.length; ++i) {
	    ids.push(req.body[i]._id);
	}

	Product.find({ _id : { $in : ids } }).exec(function(err, val_products) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			val_products.forEach(function(val){

				req.body.forEach(function(updateProduct){
					if(val._id+'' === updateProduct._id+''){
						val.status = updateProduct.status;
					}
				});
				val.save();
			});
			res.jsonp(val_products);			
		}
	});
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
	var product = req.product ;

	product.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * List of Products
 */
exports.list = function(req, res) { 
	Product.find().sort('-created').populate('proveedor').exec(function(err, products) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(products);
		}
	});
};

exports.getProduct = function(req, res){
	Product.find({ _id : req.body.id }).populate('precio_compra.id_proveedor').populate('precio_venta.proveedor.id_proveedor').exec(function(err,products){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			res.jsonp(products[0]);
		}
	});
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) { 
	Product.findById(id).populate('user', 'displayName').exec(function(err, product) {
		if (err) return next(err);
		if (! product) return next(new Error('Failed to load Product ' + id));
		req.product = product ;
		next();
	});
};

/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.product.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

//upload picture product
exports.uploadAvatar = function(req, res, next){
	var oldPath = req.files.myFile.path;
    var separator = '/';
    var filename = oldPath.split(separator)[oldPath.split(separator).length-1];
    var split = filename.split('.');
    var name = req.body.userid + '@2x.' + split[1];
    var namethumb = req.body.userid + '.'+split[1];

    var newPath = ['./public', 'img', 'placeholders', 'products', name].join(separator);
    var newPathThumb = ['./public', 'img', 'placeholders', 'products',  namethumb].join(separator);

    fs.rename(oldPath, newPath, function (err) {
        if (err === null) {
            Product.find({ _id : req.body.userid }).exec(function(err, product){
            	product[0].thumbimage = 'img/placeholders/products/'+namethumb;
            	product[0].fullimage = 'img/placeholders/products/'+name;
            	product[0].save(function(error){
	                im.resize({
					  srcPath: newPath,
					  dstPath: newPathThumb,
					  width:   64
					}, function(err, stdout, stderr){
					  return res.send(product);
					  
					});
	                
            	});
            });
        }
    });
};