const express = require('express');
const createError = require('http-errors');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const route = require('./routes');
const database = require('./config/database');

const app = express();

database.connect();
// view engine setup
app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
