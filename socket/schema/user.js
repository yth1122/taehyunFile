const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
	id:String,
	name:String,
	password:String,
	createdAt:{
		type:Date,
		default:Date.now,
	},

});
module.exports = mongoose.model("USER",userSchema); 