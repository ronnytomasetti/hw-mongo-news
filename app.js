// =================================================================
// Dependencies
// =================================================================
var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var routes = require('./routes/index');

// =================================================================
// Initialize new Express app
// =================================================================
var app = express();

// =================================================================
// View engine setup
// =================================================================
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// =================================================================
// Configure page favicon and public web folder
// =================================================================
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public/assets/img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// =================================================================
// Setup logger
// =================================================================
app.use(logger('dev'));

// =================================================================
// Configure body-parser middleware
// =================================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// =================================================================
// Initialize and use cookie-parser
// =================================================================
app.use(cookieParser());

// =================================================================
// Initialize and use methodOverride
// =================================================================
app.use(methodOverride('_method'));

// =================================================================
// Configure application routes
// =================================================================
app.use('/', routes);

// =================================================================
// Configure MongoDB connection
// =================================================================
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongo_news';

mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

// Log Mongo errors to console.
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to db through mongoose, log success message.
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// =================================================================
// Catch 404 errors, forward to error handlers below.
// =================================================================
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler - development error handler will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// Error handler - production handler not leaking stacktrace to user
app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
