'use strict';
var debug = require('debug');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
//Connecting to db
const MongoClient = require('mongodb').MongoClient;
const MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
const uri = "mongodb+srv://britt:unknownpassword@cluster0-vzczn.azure.mongodb.net/user?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
try {
    mongoose.connect(uri, { useNewUrlParser: true });
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open', function (callback) {
        useUnifiedTopology: true
        console.log('Connected to MongoDB');
    });
} catch (err) {
    console.log("Error : " + err);
}
var routes = require('./routes/index');
var users = require('./routes/users');
const userModel = require('./models/user'); 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport session
app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);

//Serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

//Deserialize user try to find username
passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
        done(err, user);
    });
});

//Local strategy used for logging users
passport.use(new LocalStrategy(
    function (username, password, done) {
        userModel.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            //Compare hashed passwords
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

// catch 404 and forward to error handler

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
