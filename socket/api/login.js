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
                comment:'fuck'
            }, 
            secret, 
            {
                expiresIn: '5d',
                issuer: 'taetae.com',
                subject: 'userInfo'
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