var express = require('express');
const { User } = require('../models');
var router = express.Router();
var models = require('../models');
const user = require('../models/user');
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy; //passport 참조
const { session } = require('passport');


var isAuthenticated = function(req,res,next){
  console.log(123);
  if(req.isAuthenticated()){
    console.log('it work');
    return next();}
  res.redirect('/signup');
};


/* 로그인 페이지 */
router.get('/', function(req, res, next) {
  res.render('login');
});


/*가입페이지 */
router.get('/signup', function(req,res,next){
  res.render('signup');
});

/*가입절차 */

router.post('/signup', function(req,res,next){
  let body = req.body;

  models.user.create({//내가 등록할 테이블의 model이름과 일치시켜야 함
    uid : body.userID,
    upw : body.userPW,
    nickname : body.userName,
    deleted : 0
  }) 
    .then(result => {
      console.log("데이터 추가 완료");
      res.redirect('/');
    })
    .catch(err=>{
      console.log("데이터 추가 실패");
      console.log(err);
      res.redirect('/signup');
    })
})



/*passport사용해서 인증 구현 */
router.post('/login', 
  passport.authenticate('local',{successRedirect: '/myPage',
                                failureRedirect : '/signup',
                                failureFlash: true},
)
);

/*마이 페이지*/
router.get('/myPage', isAuthenticated, function(req,res,next){
  console.log(123123);
  console.log(req.user.uid);
  res.render('myPage', {userId : req.user.uid});
  
});
//desirealizeUser에서 done의 두번째 인자가 request.user안에 저장된다.


/*발자취 목록*/
router.get('/allFoot', function(req,res,next){
  res.render('allFoot');
});

/*유저정보 수정하기*/
router.get('/userInfoFix', function(req,res,next){
  res.render('userInfoFix');
});

/*발자취 사이트*/
router.get('/footPost', function(req,res,next){
  res.render('footPost');
});

/*발자취 데이터등록 및 오류*/
router.post('/footPost', function(req,res,next){
  let body = req.body;

  models.user.create({
    foot_name : body.footName,
    footcontent : body.footCont,
    deleted : 0,
  }).then(result =>{
    console.log("발자취 등록 완료");
    res.redirect("/myPage");
  })
  .catch(err=>{
    console.log("발자취 등록 실패");
    console.log(err);
    res.redirect('/footPost');
  })
});
module.exports = router;


