var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var User = require('./models/user');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);

var url = "mongodb+srv://sal17030:EN4tIocadHIo37U9@cluster0.xurwntk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// EN4tIocadHIo37U9

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var store = new MongoDBStore({
  uri: url,
  collection: "sessions"
},
function(error) {
  // Should have gotten an error
});

store.on('error', function(error) {
  console.log(error);
});

app.use(session({secret: "my love", resave: false, saveUninitialized: false, store: store}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

mongoose.connect(url)
.then(result => {
  app.listen(5000);
})
.catch(err => {
  console.log(err);
});

module.exports = app;
