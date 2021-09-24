var express = require('express');
var router = express.Router();
const localStorage = require("localStorage");
const jwt = require('jsonwebtoken');
const Room = require('../schema/room');
const Chat = require('../schema/chat');

function check(req,res){
	if(!req.cookies.jwt){
		console.log('ggg');
		res.redirect('/login');
	}else{
		res.next; 
	}
}

router.get('/chat',function(req,res,next){

})



router.get('/regUser',function(req,res){
	try{
		res.render('regUser');
	}catch(err){
		res.status(500).send(err);
	}
})
router.get('/',async function(req,res){
	const rooms = await Room.find({}).sort({'createdAt':-1});
	try{
		if(!req.cookies.jwt){
			console.log('go login');
			res.redirect('/login');
		}else{
			console.log('go main')
	 		res.render('main',{rooms,title:'TAETAE'});
		}
		// res.cookie('user',{name:'taehyun',age:28})
	}catch(err){
		res.status(500).send(err);
	}
})

router.get('/room', (req, res) => {
	res.render('room.html', { title: 'GIF 채팅방 생성' });
});


router.post('/room', async (req, res, next) => {
	const secret = req.app.get('jwt-secret');
	try {
		var token= req.cookies.jwt;
		const g = jwt.verify(token,secret);
		const newRoom = await Room.create({
		title: req.body.title,
		max: req.body.max,
		owner: g.id,
		password: req.body.password,
	  });
	  const io = req.app.get('io');
	  io.of('/room').emit('newRoom', newRoom);
	  res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
	} catch (error) {
	  console.error(error);
	  next(error);
	}
  });

router.post('/room/:id/chat', async (req, res, next) => {
		// try {
		// 	const chat = await Chat.create({
		// 		room: req.params.id,
		// 		user: ,
		// 		chat: req.body.chat,
		// 	});
		// 	req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
		// 	res.send('ok');
		// } catch (error) {
		// 	console.error(error);
		// 	next(error);
		// }
});



router.get('/room/:id', async (req, res, next) => {
	const secret = req.app.get('jwt-secret');
	try {
		var token= req.cookies.jwt;
		const g = jwt.verify(token,secret);
	  const room = await Room.findOne({ _id: req.params.id });
	  const io = req.app.get('io');
	  if (!room) {
		return res.redirect('/?error=존재하지 않는 방입니다.');
	  }
	  if (room.password && room.password !== req.query.password) {
		return res.redirect('/?error=비밀번호가 틀렸습니다.');
	  }
	  const { rooms } = io.of('/chat').adapter;
	  if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
		return res.redirect('/?error=허용 인원이 초과하였습니다.');
	  }
	  const chats = await Chat.find({ room: room._id }).sort('createdAt');
		console.log(chats);
	  return res.render('chat', {
		room,
		title: room.title,
		chats,
		user: g.id,
	  });
	} catch (error) {
	  console.error(error);
	  return next(error);
	}
  });


module.exports = router ;