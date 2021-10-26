const mongoose = require('mongoose');

const { Schema } = mongoose;
const listSchema = new Schema({
	parent:Number,
	name:String,
	createdAt:{
		type:Date,
		default:Date.now,
	},

});
module.exports = mongoose.model("List",listSchema); 