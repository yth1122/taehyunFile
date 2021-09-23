var express = require('express');
var router = express.Router();
const localStorage = require("localStorage");
const jwt = require('jsonwebtoken');
const Room = require('../schema/room');
const Chat = require('../schema/chat');


router.get('/regUser',function(req,res){
	try{
		// res.cookie('user',{name:'taehyun',age:28})
		
		res.render('regUser.html');
	}catch(err){
		res.status(500).send(err);
	}
})
router.get('/',function(req,res){
	try{
		console.log(localStorage.getItem('data'));
		if(!localStorage.getItem('data')){
			res.redirect('/login')
		}
		// res.cookie('user',{name:'taehyun',age:28})
		res.render('main.html');
	}catch(err){
		res.status(500).send(err);
	}
})

router.get('/room', (req, res) => {
	res.render('room.html', { title: 'GIF 채팅방 생성' });
});


router.post('/room', async (req, res, next) => {
	
	try {
		const g = jwt.verify(token,secret);
		console.log(g);
	// 	const newRoom = await Room.create({
	// 	title: req.body.title,
	// 	max: req.body.max,
	// 	owner: ,
	// 	password: req.body.password,
	//   });
	//   const io = req.app.get('io');
	//   io.of('/room').emit('newRoom', newRoom);
	//   res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
	} catch (error) {
	  console.error(error);
	  next(error);
	}
  });


router.get('/room/:id', async (req, res, next) => {
	try {
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
	  return res.render('chat', {
		room,
		title: room.title,
		chats,
		user: req.session.color,
	  });
	} catch (error) {
	  console.error(error);
	  return next(error);
	}
  });


module.exports = router ;