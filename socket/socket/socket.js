const SocketIO = require('socket.io');

module.exports = (server,app) =>{
	const io = SocketIO(server, {path : '/socket.io'});
	app.set('io',io);
	const room = io.of('/room');
	const chat = io.of('/chat');
	const user = io.of('/user');
	
	user.on('connection',(socket)=>{
		console.log('user 접속');
		socket.on('disconnect',()=>{
			console.log('user 접속 해제');
		})	

	});
	chat.on('connection',(socket)=>{
		console.log('chat 접속');
		socket.on('disconnect',()=>{
			console.log('chat 접속해제');
		})
	})

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