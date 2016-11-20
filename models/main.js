var mongoose = require('mongoose'),
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
	title: String,
	container: [{
		divId: String,
		styles: String,
		stylesInner: String,
		className : String,
		text: String
	}],
	date: {type: Date, default: Date.now}
});

// ------------------------
// *** Plugins Block ***
// ------------------------

userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

// ------------------------
// *** Exports Block ***
// ------------------------

module.exports.User = mongoose.model('User', userSchema);
module.exports.Promo = mongoose.model('Promo', promoSchema);
