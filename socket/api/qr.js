var express = require('express');
var router = express.Router();
const QRCode = require("qrcode");
var polldata = null;


router.get('/image/:session',function(req,res){
	var session = req.params.session;
	// console.log(req); 
	try{
		QRCode.toDataURL('https://testmonitor-dot-centered-sight-237801.an.r.appspot.com/web/qrlogin/'+session,function(err,code){
			if(err) console.log (err)
			// console.log(res);	
			res.send(code);
		})
	}catch(err){

	}
});

router.get('/polling/:session',function(req,res){
	var session =req.params.session;
	console.log(req);
	polldata = null;
	console.log('polling',session);
	var count = 0;
	var polling = setInterval(() => {	
		count++
		if(polldata){
			if(session == polldata.session){
				console.log('pollll123',polldata);
				res.send(polldata);
				clearInterval(polling);
			}	
		}else if(count>=180){
			res.send({success:false,message:'시간이 경과되었습니다'})
			clearInterval(polling);
		}
	}, 1000);
	// .catch((err)=>console.log(err));
	// console.log(response);
})


router.post('/broadcast',function(req,res){
	var data = req.body;
	try{
		// console.log(polling);
		polldata = data;
		res.send('send');
	}catch(err){
		res.status(500).send(err.message);
	}
})

module.exports = router ; 