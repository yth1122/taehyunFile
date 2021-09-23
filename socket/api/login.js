var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const localStorage = require("localStorage");
const crypto = require('crypto');

var userMongo= require('../schema/user');
const { render } = require('../app');

//회원가입
router.post('/',async function(req,res){
  console.log(req.body);
	let password ;   
	await crypto.randomBytes(64,(err,buf)=>{
		crypto.pbkdf2(req.body.pw , 'YTH' , 100000 , 64 , 'sha512',(err,key)=>{
			password = key.toString('base64');
			console.log(password);
			userMongo.create({
				id:req.body.id,
				name:req.body.name,
				password:password
			})  
		})
	})
	
	res.redirect('/login');
})
//아이디 중복 체크
router.get('/check/:id',async function(req,res){
	var vid= req.params.id;
	userMongo.find({id:vid}).then(r=>{
		res.send(r);
	}).catch(function(err){
		console.log(err);
	})
});
//로그인 후 jwt Token
router.post('/login',async function(req,res){
	console.log(req.body);
	var password;
	const secret = req.app.get('jwt-secret');
	//body secret 비교
	crypto.randomBytes(64,(err,buf)=>{
		crypto.pbkdf2(req.body.pw , 'YTH' , 100000 , 64 , 'sha512',(err,key)=>{
			password = key.toString('base64');
			
			userMongo.find({id:req.body.id}).then(r=>{
				// console.log(password,r[0].password);
				if(r.length==0){
					res.send('없는 아이디입니다');
				}else{
					if(r[0].password != password){
						res.send('비밀번호가 일치하지 않습니다');
					}else{
						const p = new Promise((resolve,reject) => {
							jwt.sign(
									{
											id: r[0].id,
											name:r[0].name,
											pw:r[0].password
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
							res.send('로그인 성공');
							// res.redirect('http://localhost:3000/regUser');	
							localStorage.setItem('data',token);
							const g = jwt.verify(token,secret);
							// console.log(localStorage.getItem('data'));
							console.log(g);
							// res.send(g);
						}).catch(err=>{
								console.log(err);
						});
					}
				}
			}).catch(function(err){
				console.log(err);
			})
		})
	})		
})

router.get('/logout',function(req,res){
	const secret = req.app.get('jwt-secret');
	localStorage.removeItem('data');
	console.log(localStorage.getItem('data'));
	res.redirect('/');
});


router.get('/',function(req,res){
	try{
		// res.cookie('user',{name:'taehyun',age:28})
		res.render('login.html');
	}catch(err){
		res.status(500).send(err);
	}
})



// router.get('/',async function(req, res) {
//     const secret = req.app.get('jwt-secret');
//     const p = new Promise((resolve,reject) => {
//         jwt.sign(
//             {
//                 username: 'taehyun',
//                 type:'human',
//                 comment:'hellow'
//             }, 
//             secret, 
//             {
//                 expiresIn: '5d',//토큰 만료시간
//                 issuer: 'taetae.com',//토큰 발행자
//                 subject: 'userInfo'//토큰 제목
//             }, (err, token) => {
//                 if (err) reject(err)
//                 resolve(token) 
//             })
//     }).then(token=>{
//         localStorage.setItem('data',token);
//         const g = jwt.verify(token,secret);
//         console.log(localStorage.getItem('data'));
//         res.send(g);
//         // res.redirect('http://localhost:3000');
//       }).catch(err=>{
//               console.log(err);
//       });
//     })
module.exports = router ;