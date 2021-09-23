const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types:{ objectId } } = schema;
const chatSchema = new Schema({
	room:{
		type: objectId ,
		required:true,
		ref:'Room',
	},
	
	user:{
		type:String,
		required:true,
	},
	chat:String,
	gif:String,
	createdAt:{
		type:Date,
		default:Date.now,
	},

});
module.exports = mongoose.model("Chat",chatSchema); 