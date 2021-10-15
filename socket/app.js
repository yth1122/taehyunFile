const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser') ;
const logger = require('morgan');
const Router = require('./router/router');
const app = express();
const port = '3000';
const passport = require('passport')
const connect = require('./schema');
const webSocket = require('./socket/socket.js');
const session = require('express-session');
app.set('view engine', 'html');
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
// app.engine('html', require('ejs').renderFile);
connect();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use('/emo',express.static(path.join(__dirname, 'public/emoticon')));
app.use(logger('short'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({ secret: '1122', resave: true, saveUninitialized: false }));
//passport setting
app.use(passport.initialize());
app.use(passport.session());
app.use('/', Router);
app.set('jwt-secret', "1122");
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

webSocket(server,app);

module.exports = app;
