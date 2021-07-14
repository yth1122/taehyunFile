const express = require('express');
const router = express.Router();
const api = require('../api/index');

const path = require('path');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  })
router.use('/yhs', api);


module.exports = router ;