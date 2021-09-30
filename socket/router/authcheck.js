const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

const authMiddleware = (req, res, next) => {
    // read the token from header or url 
    const token = req.cookies.jwt;
    // req.headers['x-access-token'] || req.query.token
    // token does not exist
    if(!token) {
       console.log('gigigigi');
    //    res.render('login');
       // res.redirect('/');
        // return res.redirect('/login')
    }

    // // create a promise that decodes the token
    // const p = new Promise(
    //     (resolve, reject) => {
    //         jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
    //             if(err) reject(err)
    //             resolve(decoded)
    //         })
    //     }
    // )

    // // if it has failed to verify, it will return an error message
    // const onError = (error) => {
    //     res.status(403).json({
    //         success: false,
    //         message: error.message
    //     })
    // }

    // // process the promise
    // p.then((decoded)=>{
    //     console.log(decoded);
    //     next()    
    // })
    // .catch(onError)
    
}

module.exports = authMiddleware