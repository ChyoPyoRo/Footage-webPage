var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//sequelize를 사용하기 위해 models 폴더에서 index.js를 읽어오도록 require
const models = require('./models/index.js');
const { REPL_MODE_SLOPPY } = require('repl');

var session = require('express-session');
const MariaDBStore = require('express-session-mariadb-store');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy; //passport 참조
const user = require('./models').user;

const flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

models.sequelize.sync().then( ()=>{
  console.log("DB연결성공");
}).catch(err=> {
  console.log("연결 실패");
  console.log(err);
})

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,

}))

app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser(function(user, done) {
  console.log("serializeUser ", user)
  done(null, user.userId);
});

passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  done(null, user); // 여기의 user가 req.user가 됨
});

passport.use(new LocalStrategy({
  usernameField: 'userId',
  passwordField: 'userPW',
  session : true,
  passReqToCallback: true,
}
,async (req, userId, userPW, done)=>{    console.log(1234);
  const userRes = await user.findOne({where: {uid : userId}} )
  if(userRes == null) done(null,false,{message : 'id가 틀렸거나 존재하지 않습니다'});
  if(userRes.upw != userPW) done(null, false, {message: 'pw가 틀렸습니다'});
  console.log(userRes);
  done(null,userRes);
  
}))

app.use(flash());
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
  res.render('error.ejs');
});

module.exports = app;
