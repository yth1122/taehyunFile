var express = require('express');
var router = express.Router();

//정리완료
router.use('/user', require('./UserAPI'))
router.use('/vac', require('./VacationAPI'))
router.use('/auth',require('../conf/auth'));



module.exports = router ;