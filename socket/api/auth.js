const passport = require('passport') ;
const KakaoStrategy = require('passport-kakao').Strategy;
var express = require('express');
var router = express.Router();
const FacebookStrategy = require('passport-facebook').Strategy; 
const NaverStrategy = require('passport-naver').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
var config = require('../config/config');
const jwt = require('jsonwebtoken');
var userMongo= require('../schema/user');

// facebook.id='273494967956069';
// facebook.pwd='e85398ec5df66547097d1eeb5a39acff';

function check(id,name,profile,type,req,res){
  userMongo.find({id:id,type:type}).then(r=>{
    if(r.length==0){
      userMongo.create({
        id:id,
        name:name,
        type:type,
        profile:profile
      })
    }else{
      console.log('already exist');
    }  
  });
  var secret = req.app.get('jwt-secret');
  let token = jwt.sign({
          name: name,
          id: id,
          profile : profile,
      }, secret, { expiresIn: '8h' });
  res.cookie('jwt', token);
  res.redirect('/');
};


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
//kakao
passport.use(new KakaoStrategy({
    clientID: config.kakaoID,
    callbackURL: 'http://localhost:3000/auth/kakao/callback',
    }, function (accessToken, refreshToken, x, profile,done){
        // console.log(profile);
         return done(null,profile); 
}));

router.get('/kakao',passport.authenticate('kakao'));

router.get('/kakao/callback',passport.authenticate('kakao',{
	failureRedirect: '/',
}),function(req,res){
  var info = req.user._json;
  // console.log(req.user.provider);
  // console.log(info.properties.nickname,info.properties.profile_image,req.user.provider,info.kakao_account.email);
  check(info.kakao_account.email,info.properties.nickname,info.properties.profile_image,req.user.provider,req,res);
  // console.log(req.user.properties.nickname,req.user.properties.profile_image,req.user.kakao_account.email);
});

//google
passport.use(new GoogleStrategy({
  clientID: config.googleID,
  clientSecret: config.googleSecret,
  //callbackURL: conf.callbackURL
  callbackURL: 'http://localhost:3000/auth/google/callback'
},function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    return done(null,profile);
  }
));

router.get('/google',passport.authenticate('google',{scope: ['profile','email']}));

router.get('/google/callback', passport.authenticate('google'),(req, res)=>{
  var info = req.user;
  console.log(info);
  check(info._json.email,info.name.givenName,info._json.picture,info.provider,req,res);
 
  // var secret = req.app.get('jwt-secret');
  // let token = jwt.sign({
  //         name: req.user.name.givenName,
  //         id: req.user._json.email,
  //         profile : req.user._json.picture
  //     }, secret, { expiresIn: '8h' });
  // res.cookie('jwt', token)
  // res.redirect('/');
})

//naver
passport.use(new NaverStrategy({
  clientID: config.naverID,
  clientSecret: config.naverSecret,
  callbackURL: 'http://localhost:3000/auth/naver/callback'
},function (accessToken, refreshToken, profile, done) {
    return done(null,profile);
  }
));

router.get('/naver',passport.authenticate('naver'));

router.get('/naver/callback',passport.authenticate('naver',{
  failureRedirect:'/',
}),function(req,res){
  console.log(req.user);
  var info = req.user._json;
  check(info.email,info.nickname,info.profile_image,req.user.provider,req,res);
});


//facebook https:// 에서만 사용가능
passport.use(new FacebookStrategy({
  clientID: config.facebookID,
  clientSecret: config.facebookSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
    'updated_time', 'verified', 'displayName']
  }, function (accessToken, refreshToken, profile, done) {
      console.log(profile);
  }
));

router.get('/facebook',passport.authenticate('facebook'));

router.get('/facebook/callback',passport.authenticate('facebook',{
  failureRedirect:'/',
}),function(req,res){
    res.redirect('/regUser');
});





module.exports = router ;