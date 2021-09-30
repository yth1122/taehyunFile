const mongoose = require('mongoose');
const env = require('dotenv').config();
const { MONGO_ID,MONGO_PASSWORD,NODE_ENV } = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;
const connect = () =>{
	if (NODE_ENV !== 'production'){
		mongoose.set('debug',true);
	}
	mongoose.connect(MONGO_URL,{
		dbName:'gifchat',
		useNewUrlParser: true,
		useCreateIndex:true,
		useUnifiedTopology: true,
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