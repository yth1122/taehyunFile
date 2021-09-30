const passport = require('passport') ;
const KakaoStrategy = require('passport-kakao').Strategy;
var express = require('express');
var router = express.Router();
const FacebookStrategy = require('passport-facebook').Strategy; 
const NaverStrategy = require('passport-naver').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
var config = require('../config/config');
const jwt = require('jsonwebtoken');


// facebook.id='273494967956069';
// facebook.pwd='e85398ec5df66547097d1eeb5a39acff';

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});
//kakao
passport.use(new KakaoStrategy({
    clientID: config.kakaoID,
    callbackURL: 'http://localhost:3000/auth/kakao/callback',
    }, function (accessToken, refreshToken, profile, x,done){
          // console.log(accessToken); 
				  // console.log(profile);
         return done(null,profile); 
}));

router.get('/kakao',passport.authenticate('kakao'));

router.get('/kakao/callback',passport.authenticate('kakao',{
	failureRedirect: '/',
}),function(req,res){
	res.redirect('/regUser');
});

//google
passport.use(new GoogleStrategy({
  clientID: config.googleID,
  clientSecret: config.googleSecret,
  //callbackURL: conf.callbackURL
  callbackURL: 'http://localhost:3000/auth/google/callback'
},function(accessToken, refreshToken, profile, done) {
    
    console.log(profile);
    return done(null,profile);
  }
));

router.get('/google',passport.authenticate('google',{scope: ['profile','email']}));

router.get('/google/callback', passport.authenticate('google'),(req, res)=>{
  let token = jwt.sign({
          name: req.user.name.givenName,
          email: req.user._json.email,
          picture : req.user._json.picture
      }, '1234', { expiresIn: '8h' });
  res.cookie('jwt', token)
  console.log("TOKEN", token)
  
  res.redirect('/regUser');
})

//naver
passport.use(new NaverStrategy({
  clientID: config.naverID,
  clientSecret: config.naverSecret,
  callbackURL: 'http://localhost:3000/auth/naver/callback'
},function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null,profile);
  }
));

router.get('/naver',passport.authenticate('naver'));

router.get('/naver/callback',passport.authenticate('naver',{
  failureRedirect:'/',
}),function(req,res){
    res.redirect('/regUser');
});






//facebook https:// 에서만 사용가능
passport.use(new FacebookStrategy({
  clientID: config.facebookID,
  clientSecret: config.facebookSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
    'updated_time', 'verified', 'displayName']
  }, function (accessToken, refreshToken, profile, done) {
      console.log(accessToken);
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