var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
	try{
		// res.cookie('user',{name:'taehyun',age:28})
		res.render('index.html');
	}catch(err){
		res.status(500).send(err);
	}
})
router.get('/regUser',function(req,res){
	try{
		res.cookie('user',{name:'taehyun',age:28})
		res.render('regUser.html');
	}catch(err){
		res.status(500).send(err);
	}
})


module.exports = router ;