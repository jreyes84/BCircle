'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	if(req.user === undefined){
		res.render('login');
	}else{
		res.render('index', {
			user: req.user || null
		});
	}
};