const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const conf = require('./config')
const jwt = require('jsonwebtoken')


const auth = express()

auth.use(bodyParser.urlencoded({ extended: true })) 
auth.use(cookieParser())
auth.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: conf.clientID,
    clientSecret: conf.clientSecret,
    //callbackURL: conf.callbackURL
    callbackURL: conf.callbackURL_dev
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile)
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

auth.get('/login',  passport.authenticate('google', { scope: ['profile','email'] }))
auth.get('/user/callback', passport.authenticate('google'),(req, res)=>{
    let token = jwt.sign({
            name: req.user.name.givenName,
            email: req.user._json.email,
            picture : req.user._json.picture
        }, conf.secret, { expiresIn: '8h' });
    res.cookie('jwt', token)
    //console.log("TOKEN", token)
    res.redirect('http://dev.yeonhapsystem.co.kr:33333')
})

auth.post('/check', (req, res)=>{
    const token = req.headers['x-access-token'] || req.cookies['jwt'] || req.body.jwt
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, conf.secret, (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
        res.send(error)
    }
    p.then((decoded)=>{
        req.decoded = decoded
        res.send(decoded)
    }).catch(onError)
})


module.exports = auth;