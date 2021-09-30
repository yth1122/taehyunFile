const express = require('express');
const router = express.Router();
var socket = require('../api/socketAPI.js'); 
// const view = require('../views/index.html');
var authCheck = require('./authcheck.js') 
var login = require('../api/login.js');
// router.use('/',authCheck);
var auth = require('../api/auth.js');
router.use('/',socket);
router.use('/login',login);
router.use('/auth',auth);
module.exports = router;