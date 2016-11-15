var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt'),
		Schema = mongoose.Schema;

var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: {type: String, default: 'User'},
	date: {type: Date, default: Date.now},
});

var promoSchema = new Schema({
	//movie params
	movie: Number,
	widget_key: String,
	imax: Boolean,

	//styles
	background_color: String, //!
	background_image: String, //!
	header_font_family: String, //!
	base_font_family: String, //!

	// --------------------------------------

	//title block
	title: String,
	title_font_size: Number,
	title_custom_css: String,

	//subtitle block
	subtitle: { type: String, trim: true, locale: true },
	subtitle_font_size: Number,
	subtitle_custom_css: String,

	//description block
	description: { type: String, trim: true, locale: true },
	subtitle_font_size: Number,
	subtitle_custom_css: String,

	//map block
	map: Boolean,
	map_zoom: Number,

	buy_button: Boolean,
	position: Number,

	images: [{
		description: { type: String, trim: true, locale: true },
		cast: Boolean,
		original: String,
		thumb: String
	}],
	videos: [{type: String, trim: true}],

	date: {type: Date, default: Date.now},
	status: String,

	code: String //-

});

// ------------------------
// *** Plugins Block ***
// ------------------------

userSchema.plugin(mongooseBcrypt, { fields: ['password'] });
promoSchema.plugin(mongooseLocale);

// ------------------------
// *** Exports Block ***
// ------------------------

module.exports.User = mongoose.model('User', userSchema);
module.exports.Promo = mongoose.model('Promo', promoSchema);
