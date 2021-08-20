const express = require('express');
const router = express.Router();
var socket = require('../api/socketAPI.js'); 
// const view = require('../views/index.html'); 
router.use('/',socket);

module.exports = router;