var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const localStorage = require("localStorage");

router.get('/',async function(req, res) {
    const secret = req.app.get('jwt-secret');
    const p = new Promise((resolve,reject) => {
        jwt.sign(
            {
                username: 'taehyun',
                type:'human',
                comment:'hellow'
            }, 
            secret, 
            {
                expiresIn: '5d',//토큰 만료시간
                issuer: 'taetae.com',//토큰 발행자
                subject: 'userInfo'//토큰 제목
            }, (err, token) => {
                if (err) reject(err)
                resolve(token) 
            })
    }).then(token=>{
        localStorage.setItem('data',token);
        const g = jwt.verify(token,secret);
        console.log(localStorage.getItem('data'));
        res.send(g);
        // res.redirect('http://localhost:3000');
          }).catch(err=>{
              console.log(err);
          });
        })
module.exports = router ;