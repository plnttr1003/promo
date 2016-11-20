var path = require('path');
var jade = require('jade');

var Promo = require('../models/main.js').Promo;

var __appdir = path.dirname(require.main.filename);

exports.index = function(req, res) {
	Promo.find().where('title').nor([{'status': 'hidden'}, {'status': 'out'}]).sort('position').limit(15).exec(function(err, promo) {
		res.render('main', {promo: promo});
	});
}