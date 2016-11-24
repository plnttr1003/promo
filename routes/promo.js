var jade = require('jade');
var path = require('path');
var __appdir = path.dirname(require.main.filename);

var Promo = require('../models/main.js').Promo;

exports.index = function(req, res) {
	Promo.where('title').where('status').ne('hidden').limit(12).sort('-date').exec(function(err, promo) {
		res.render('promo', {promo: promo});
	});
}

exports.promo = function(req, res) {
	var id = req.params.id;
	Promo.findById(id).exec(function(err, promo) {
		res.render('promo/promo.jade', {promo: promo});
	});

}

exports.get_promo = function(req, res) {
	var post = req.body;

	Promo.where('title').where('status').ne('hidden').sort('-date').skip(post.skip).limit(post.limit).exec(function(err, promo) {
		if (promo.length > 0) {
			res.send(jade.renderFile(__appdir + '/views/promo/get_promo.jade', {promo: promo, locale: req.locale}));
		} else {
			res.send('out');
		}
	});
}