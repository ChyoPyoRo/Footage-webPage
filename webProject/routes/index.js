var express = require('express');
var router = express.Router();
var models = require('../models');

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


router.post('/login', function(req,res,next){//로그인페이지에서 로그인할시 / 마이페이지 이
  models.user.findOne({
    where : {uid: "aaa"}
  }).then(result => {
    res.render("myPage",{
      user: result
    });
    console.log(result.dataValues);
  })
  .catch(function(err){
    console.log(err);
  });
});


module.exports = router;
