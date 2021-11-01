var express = require('express');
var router = express.Router();
const localStorage = require("localStorage");
const jwt = require('jsonwebtoken');
const Room = require('../schema/room');
const Chat = require('../schema/chat');
const User = require('../schema/user');
const Emoticon= require('../schema/emoticon');
const List = require('../schema/emoticon_list'); 
const path = require('path');
const fs = require('fs');
const multer = require('multer');

router.get('/test',async function(req,res){
	var id = req.params.id;
	try{
		const test = await Emoticon.create({ id:1,
		path:'cute/',
		name:'순딩'});
		console.log(test);
	// res.send(test);
	}catch(err){
		res.status(500).send(err);
	}	
	
})


router.get('/regUser',function(req,res){
	try{
		res.render('regUser',{title:'TAETAE'});
	}catch(err){
		res.status(500).send(err);
	}
})
router.get('/',async function(req,res){
	const rooms = await Room.find({}).sort({'createdAt':-1});
	try{
		if(!req.cookies.jwt){
			res.redirect('/login');
		}else{
			console.log('go main')
	 		res.render('main',{rooms,title:'TAETAE'});
		}
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
	try {
			const chat = await Chat.create({
				room: req.params.id,
				user: req.body.user,
				chat: req.body.chat,
			});
			const info = await User.find({id:chat.user});
			const profile = info[0].profile;
			console.log(profile);
			req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat , profile);
			res.send('ok');
		} catch (error) {
			console.error(error);
			next(error);
		}
});

try {
	//uploads 에서 찾고
  fs.readdirSync('uploads');
} catch (err) {
	//없을시 uploads폴더 생성
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
};

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
			//같은사진 중복으로 올릴수있게 올린 파일 네임에 시간을 붙혀서 업로드
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/room/:id/emoticon', async (req, res, next) => {
  const secret = req.app.get('jwt-secret');
	try {
		//req에서 쿠키를 받아 지정해둔 jwt token secret을 사용하여 id값을 받아옴 이름 사용시 g.name
		var token= req.cookies.jwt;
		const g = jwt.verify(token,secret);
    var index = req.body.src.split('/emoticon');
		console.log(index[1]);
		// var emo = index[index.length-1];
		const chat = await Chat.create({
    	room: req.params.id,
    	user: g.id,
    	emoticon: index[1],
    });
		const info = await User.find({id:chat.user});
		const profile = info[0].profile;
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat , profile);
		res.send('ok');
	} catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  const secret = req.app.get('jwt-secret');
	try {
		//req에서 쿠키를 받아 지정해둔 jwt token secret을 사용하여 id값을 받아옴 이름 사용시 g.name
		var token= req.cookies.jwt;
		const g = jwt.verify(token,secret);
    const chat = await Chat.create({
      room: req.params.id,
      user: g.id,
      gif: req.file.filename,
    });
		const info = await User.find({id:chat.user});
		const profile = info[0].profile;
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat , profile);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
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
	  // const chats = await Chat.find({ room: room._id }).sort('createdAt');
		const emoti = await Emoticon.aggregate([
      {
        $lookup: {
          from: "lists",
          localField: "id",
          foreignField: "parent",
          as: "info",
        },
      },
      { $unwind: "$info" },
		],function(err,response){
			return response; 
		});;
		console.log(emoti);


		const chats = await Chat.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "id",
          as: "info",
        },
      },
      { $unwind: "$info" },
			{$match : {room:room._id} }
		],function(err,response){
			return response; 
		});
	  return res.render('chat', {
			room,
			title: room.title,
			chats,
			emoti,
			user: g.id,
	  });
	} catch (error) {
	  console.error(error);
	  return next(error);
	}
});


module.exports = router ;