var express = require('express');
var path = require('path');

// =================================================================
// Initialize new Express app
// =================================================================
var app = express();

// =================================================================
// View engine setup
// =================================================================
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// =================================================================
// Configure page favicon and public web folder
// =================================================================
// var favicon = require('serve-favicon');
// app.use(favicon(path.join(__dirname, 'public/assets/img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// =================================================================
// Setup development console logger
// =================================================================
var logger = require('morgan');
app.use(logger('dev'));

// =================================================================
// Configure body-parser middleware
// =================================================================
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// =================================================================
// Initialize and use cookie-parser
// =================================================================
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// =================================================================
// Initialize and use methodOverride
// =================================================================
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

// =================================================================
// Configure application routes
// =================================================================
var routes = require('./routes/index');
app.use('/', routes);

// Catch 404 errors, forward to error handlers below.
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// =================================================================
// Error handler - development error handler will print stacktrace
// =================================================================
if (app.get('env') === 'development') {
	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// =================================================================
// Error handler - production handler not leaking stacktrace to user
// =================================================================
app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
