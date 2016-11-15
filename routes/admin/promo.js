var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Promo = require('../../models/main.js').Promo;

var __appdir = path.dirname(require.main.filename);

// ------------------------
// *** Handlers Block ***
// ------------------------

var checkNested = function (obj, layers) {

	if (typeof layers == 'string') {layers = layers.split('.');}

	for (var i = 0; i < layers.length; i++) {
		if (!obj || !obj.hasOwnProperty(layers[i])) {return false;}
		obj = obj[layers[i]];
	}
	return true;
}

// ------------------------
// *** Admin promo Block ***
// ------------------------

exports.list = function(req, res) {
	Promo.find().sort('-date').exec(function(err, promo) {
		res.render('auth/promo/', {promo: promo});
	});
}

// ------------------------
// *** Add promo Block ***
// ------------------------

exports.add = function(req, res) {
	res.render('auth/promo/add.jade');
}

exports.add_form = function(req, res) {
	var post = req.body;
	var	promoObjects = post;

	console.log('================');
	console.log(typeof promoObjects);
	/*promoObjects.forEach(function(item){
		console.log('------------');
		console.log(item);
	})*/
	console.log(promoObjects);

	for (var key in promoObjects) {
		console.log(key);
		console.log(promoObjects[key]);
	}

	console.log(':::::::::::::::::');
	console.log(promoObjects['title'])
	//promo['ru'].title = promoObjects['title'];


	var promo = new Promo();
	promo.title = promoObjects['title'],
	promo.save(function() {
		res.redirect('/auth/promo');
	});
}


// ------------------------
// *** Edit promo Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;
  var public_path = __appdir + '/public';
  var preview_path = '/images/preview/';
  var images_preview = [];

	Promo.findById(id).exec(function(err, promo) {
		async.forEach(promo.images, function(image, callback) {
			var image_path = __appdir + '/public' + image.original;
			var image_name = image.original.split('/')[5];
			fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));
			images_preview.push(preview_path + image_name);
			callback();
		}, function() {
			res.render('auth/promo/edit.jade', {images_preview: images_preview, promo: promo});
		});
	});
}


exports.edit_form = function(req, res) {
	var post = req.body;
	var files = req.files;
	var id = req.params.id;
	var images = [];


	promo.findById(id).exec(function(err, promo) {

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& promo.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& promo.setPropertyLocalised('description', post[locale].description, locale);

			checkNested(post, [locale, 'subtitle'])
				&& promo.setPropertyLocalised('subtitle', post[locale].subtitle, locale);

		});

		promo.position = post.position;
		promo.style = post.style;
		promo.code = post.code;

		promo.movie = post.movie;
		promo.widget_key = post.widget_key;
		promo.imax = post.imax;
		promo.map = post.map;
		promo.map_zoom = post.map_zoom;
		promo.buy_button = post.buy_button;
		promo.position = post.position;
		promo.code = post.code;


		promo.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
		promo.status = post.status;

		promo.videos = post.videos.filter(function(n){ return n != '' });


		var public_path = __appdir + '/public';

		var images_path = {
			original: '/images/promo/' + promo._id + '/original/',
			thumb: '/images/promo/' + promo._id + '/thumb/',
		}

		del.sync([public_path + images_path.original, public_path + images_path.thumb]);

		if (!post.images) {
			return (function () {
				promo.images = [];
				promo.save(function() {
					res.redirect('back');
				});
			})();
		}

		mkdirp.sync(public_path + images_path.original);
		mkdirp.sync(public_path + images_path.thumb);

		promo.images = [];

		post.images.path.forEach(function(item, i) {
			var image_obj = {};
			image_obj.path = post.images.path[i];
			image_obj.cast = post.images.cast;
			image_obj.description = {ru:null, en:null};

			if (post.images.description.ru) {
				image_obj.description.ru = post.images.description.ru[i];
			}

			if (post.images.description.en) {
				image_obj.description.en = post.images.description.en[i];
			}

			images.push(image_obj);
		});

		async.forEachSeries(images, function(image, callback) {
			var name = new Date();
			name = name.getTime();
			var original_path = images_path.original + name + '.jpg';
			var thumb_path = images_path.thumb + name + '.jpg';

			gm(public_path + image.path).resize(520, false).write(public_path + thumb_path, function() {
				gm(public_path + image.path).write(public_path + original_path, function() {
					var image_obj = {};
					image_obj.original = original_path;
					image_obj.thumb = thumb_path;
					//image_obj.cast = cast;
					image_obj.description = [{
						lg: 'ru',
						value: image.description.ru
					}]
					if (image.description.en) {
						image_obj.description.push({
							lg: 'en',
							value: image.description.en
						})
					}
					promo.images.push(image_obj);
					callback();
				});
			});
		}, function() {
			promo.save(function() {
				res.redirect('back');
			})
		});


	});
}


// ------------------------
// *** Remove promo Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	Promo.findByIdAndRemove(id, function() {
		del.sync(__appdir + '/public/images/promo/' + id);
		res.send('ok');
	});
}