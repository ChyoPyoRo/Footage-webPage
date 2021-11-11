var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
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

var cookieSession = require('cookie-session');

const MySQLStore = require('express-mysql-session');

const flash = require('connect-flash');
const db = require('./models/index.js');

const bcrypt = require('bcrypt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
  store : new MySQLStore({
              host : '127.0.0.1',
              user: 'root',
              password : 'Pr12sj79',
              database : 'webProject'
            })

}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'userId',
  passwordField: 'userPW',
  session : true,
  passReqToCallback: true,
} //async비동기 : 프로세스가 종료된 이후에 작동하도록 하는것
,async (req, username, password, done)=>{    console.log(1234);
  console.log(username, password);
  const userRes = await user.findOne({where: {uid : username}} )
  console.log(5678);
  console.log(userRes);
  
  if(userRes){
  
    console.log(9101112);
    var result;
    if(password == userRes.upw){
      result = true;
    }else{
      result = false;
    }

    console.log(result);
    if(result){
      console.log('userRes in LocalStrategy:', userRes);
      console.log('result in LocalStrategy : ', result);
      done(null,userRes);
    }else{
      
      done(null,false, {message : 'pw가 틀렸습니다'});
    }
  } else{ 
    done(null, false , {message : 'id가 틀렸거나 존재하지 않는 id 입니다.'})
  }
   
}))



passport.serializeUser(function(user, done) {
  console.log("serializeUser ", user)
  console.log(12345678)
  done(null, user);
});

passport.deserializeUser(async(id, done) => { //id를 넣는 것은 오류가 invalid value: {id:1}이 뜨면서 id에 대해서 오류가 발생했기 때문
  /*
  db.query(
    'SELECT * FROM user WHRER uid = ?', [id],
    function(err,result){
      if(err) done(err);
      if(!result[0]) done(err);
      var user = result[0];
      done(null, user);
    }
  */
  
  
  
    done(null, id);
    console.log('-----------------------------------');
    //console.log(id);

  
   // 여기의 user가 req.user가 됨
});




models.sequelize.sync().then( ()=>{
  console.log("DB연결성공");
}).catch(err=> {
  console.log("연결 실패");
  console.log(err);
})


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
