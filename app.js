var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// var moment = require('moment');
// moment().format();

var session = require('express-session');
var passport = require('passport');


var app = express();

 // connect to our database
var mongoose = require('mongoose');
var dbName = 'A5DB';
var connectionString = 'mongodb://localhost:27017/' + dbName;
mongoose.connect(connectionString, require('./tests/initialize-database'));



var routes = require('./routes/index');

app.use(logger('dev'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname + '/public')));

app.use(session({resave: true, saveUninitialized: true, secret: '25jh345hj34b7h8f', cookie: { maxAge: null}}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

module.exports = app;
