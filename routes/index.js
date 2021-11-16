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
router.get('/allFoot', isAuthenticated, function(req,res,next){
  console.log(req.user);
  models.footage.findAll({where :{uid : req.user.uid} })
  .then(result => {
    console.log(11,result);
    res.render('allFoot', {
      posts : result
    });
  });
});

/*유저정보 수정하기*/
router.get('/userInfoFix', isAuthenticated, function(req,res,next){
  res.render('userInfoFix',{
    userID : req.user.uid,
    userPW : req.user.upw,
    nickname : req.user.nickname
  });
});

router.post('/userInfoFix', isAuthenticated, function(req,res,next){
  let postID = req.params.id;

  models.user.update({
    uid : req.user.uid,
    upw : req.user.upw,
    nickname : req.user.nickname,},
    {
      where: {id:postID}
  }).then(result =>{
    console.log("개인정보 수정");
    res.redirect("/myPage");
  })
  .catch(err=>{
    console.log("개인정보 수정 실패");
    console.log(err);
    res.redirect('/footPost');
  })
})

/*발자취 등록*/
router.get('/footPost', isAuthenticated, function(req,res,next){
  res.render('footPost');
});

/*발자취 데이터등록 및 오류*/
router.post('/footPost', isAuthenticated, function(req,res,next){
  let body = req.body;
  console.log(body);
  models.footage.create({
    foot_name : body.foot_name,
    footcontent : body.footCont,
    deleted : 0,
    uid : req.user.uid
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


router.get('/logout', function(req,res){
  console.log('--------------')
  console.log(req.session);
  req.logout();
  req.session.save(function(){
    res.redirect('/');
  })
  console.log('>>>>>>>>>>>>>>>>>>>>')
  console.log(req.session);
});

router.get('/edit/:id', isAuthenticated, function(req,res,next){
  let postID = req.params.id;

  models.Footage.findOne({
    where: {id:postID, uid:req.user.uid }
  })
  .then( result => {
    res.render('footFix',{
      post:result
    });
  })
  .catch( err=> {
    console.log("데이터 조회 실패");
    console.log(err);
  });
});



module.exports = router;