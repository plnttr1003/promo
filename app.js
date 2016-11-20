var mongoose = require('mongoose');
		mongoose.connect('localhost', 'main');

var express = require('express'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		accepts = require('accepts'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		methodOverride = require('method-override'),
			app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var MongoStore = require('connect-mongo')(session);
var i18n = require('i18n');

i18n.configure({
	locales: ['ru', 'en'],
	defaultLocale: 'ru',
	cookie: 'locale',
	directory: __dirname + '/locales'
});

if (process.env.NODE_ENV != 'production') {
	app.use(express.static(__dirname + '/public'));
	app.locals.pretty = true;
	app.set('json spaces', 2);
}

app.use(multer({ dest: __dirname + '/uploads', includeEmptyFields: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(i18n.init);

app.use(session({
	key: 'session',
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: {
		path: '/',
		maxAge: 1000 * 60 * 60 * 3 // 3 hours
	}
}));

app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.locale = req.cookies.locale || 'ru';
	req.locale = req.cookies.locale || 'ru';
	next();
});


// -------------------
// *** Routes Block ***
// -------------------

var main = require('./routes/main.js');
var promo = require('./routes/promo.js');

var auth = require('./routes/auth.js');
var admin_promo = require('./routes/admin/promo.js');
var admin_users = require('./routes/admin/users.js');

var options = require('./routes/admin/options.js');
var globals = require('./routes/globals.js');

// ------------------------
// *** Midleware Block ***
// ------------------------

function checkAuth (req, res, next) {
	req.session.user_id ? next() : res.redirect('/login');
}

// ------------------------
// *** Main Routes Block ***
// ------------------------

// === Main Route
app.route('/')
	.get(main.index)

// === promo Route
app.route('/promo')
	.get(promo.index)
	.post(promo.get_promo);

// === promo Route
app.route('/promo/:id').get(promo.promo);


//!

// ------------------------
// *** Admin Users Routes Block ***
// ------------------------

// === Admin users Route
app.route('/auth/users').get(checkAuth, admin_users.list);

// === Admin @add users Route
app.route('/auth/users/add')
	 .get(checkAuth, admin_users.add)
	 .post(checkAuth, admin_users.add_form);

// === Admin @edit users Route
app.route('/auth/users/edit/:id')
	 .get(checkAuth, admin_users.edit)
	 .post(checkAuth, admin_users.edit_form);

// === Admin @remove users Route
app.route('/auth/users/remove')
	 .post(checkAuth, admin_users.remove);

// === Admin promo Route
app.route('/auth/promo').get(checkAuth, admin_promo.list);

// === Admin @add promo Route
app.route('/auth/promo/add')
	 .get(checkAuth, admin_promo.add)
	 .post(checkAuth, admin_promo.add_form);

// === Admin @edit promo Route
app.route('/auth/promo/edit/:id')
	 .get(checkAuth, admin_promo.edit)
	 .post(checkAuth, admin_promo.edit_form);

// === Admin @remove promo Route
app.route('/auth/promo/remove')
	 .post(checkAuth, admin_promo.remove);

// ------------------------
// *** Auth Routes Block ***
// ------------------------

// === Auth Route
app.route('/auth').get(checkAuth, auth.main);


// === Login Route
app.route('/login')
	 .get(auth.login)
	 .post(auth.login_form);

// === Logout Route
app.route('/logout').get(auth.logout);

// === Registr Route
app.route('/registr')
	 .get(auth.registr)
	 .post(auth.registr_form);

// === Locale Route
app.route('/lang/:locale').get(globals.locale);

app.listen(process.env.PORT || 3000);
console.log('http://127.0.0.1:3000')