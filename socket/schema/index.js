const mongoose = require('mongoose');
const config = require('../config.js');
const { MONGO_ID,MONGO_PASSWORD,NODE_ENV } = config;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;
console.log(MONGO_URL);
const connect = () =>{
	if (NODE_ENV !== 'production'){
		mongoose.set('debug',true);
	}
	mongoose.connect(MONGO_URL,{
		dbName:'gifchat',
		useNewUrlParser: true,
		useCreateIndex:true,
	},(error)=>{
		if(error){
			console.log(MONGO_URL);
			console.log('connect fail');
		}else {
			console.log('connect success');
		}
	});	
};
mongoose.connection.on('error',(error)=>{
	console.error('mongoDB error',error);
})
mongoose.connection.on('disconnect',()=>{
	console.error('mongoDB disconnect please:reconnect');
	connect();
});

module.exports = connect; 