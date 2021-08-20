var express = require('express');
const { render } = require('../app');
var router = express.Router();

router.get('/',function(req,res){
	res.render('index.html');

});



module.exports = router ;