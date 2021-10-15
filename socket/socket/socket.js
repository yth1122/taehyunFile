const SocketIO = require('socket.io');
const jwt = require('jsonwebtoken');
// const secret = req.app.get('jwt-secret');
module.exports = (server,app) =>{
	const io = SocketIO(server, {path : '/socket.io'});
	app.set('io',io);
	const room = io.of('/room');
	const chat = io.of('/chat');
	const user = io.of('/user');
	const secret = app.get('jwt-secret');
	user.on('connection',(socket)=>{
		console.log('user 접속');
		socket.on('disconnect',()=>{
			console.log('user 접속 해제');
		})	

	});
	
	chat.on('connection', (socket) => {
    	console.log('chat 네임스페이스에 접속');
		const req = socket.request;
		const cookie = req.headers.cookie
		const index = cookie.indexOf('jwt');
		const token = cookie.substr(index).split(';')[0].replace('jwt=','');
		const g = jwt.verify(token,secret);
    	const { headers: { referer } } = req;
    	const roomId = referer
      	.split('/')[referer.split('/').length - 1]
      	.replace(/\?.+/, '');
			;
    	socket.join(roomId);
    	socket.to(roomId).emit('join', {
      	user: 'system',
      	chat: g.id+`이 입장하셨습니다.`,
    	})
			socket.on('disconnect',()=>{
				socket.to(roomId).emit('exit',{
					user:	'system',
					chat:	g.id+`님이 방을 나가셨습니다.`,
				})
				console.log('chat 접속 해제');
			})	
	});





	room.on('connection',(socket)=>{
		console.log('room 접속');
		socket.on('disconnect',()=>{
			console.log('room 접속해제');
		})
	})
	


	// io.on('connection', (socket) => {
	// 	const req = socket.request;
	// 	const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	// 	console.log('connect', ip , socket.id , req.ip );
	// 	socket.on('disconnect', ()=>{
	// 		console.log('disconnect', ip , socket.id )
	// 		clearInterval(socket.interval)
	// 	})
	
	// 	socket.on('error',(error)=>{
	// 		console.error(error);
	// 	});
	// 	socket.on('reply',(data)=>{
	// 		console.log(data)
	// 	});
	// 	socket.interval = setInterval(()=>{
	// 		socket.emit('news','gg')
	// 	},3000);
	// })
}