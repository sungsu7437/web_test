var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client= redis.createClient();

var index = require('./routes/index');
var users = require('./routes/users');
var topic = require('./routes/topic');

var app = express();
app.locals.pretty = true;

app.set('views', path.join(__dirname, 'views_mongo'));
app.set('view engine', 'jade');

// view engine setup
app.use(session({
    secret: '1234asdf!@#$1234',
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: client,
        prefix : "session:",
        db : 0
    }),
    resave: false,
    saveUninitialized: true
}));

var passport = require('./config/passport')(app);
var auth = require('./routes/auth')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/topic', topic);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
