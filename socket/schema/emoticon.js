const mongoose = require('mongoose');
const { checkout } = require('../api/socketAPI');

const { Schema } = mongoose;
const emoticonSchema = new Schema({
	id:Number,
	name:String,
	path:String,
	main:String,
	createdAt:{
		type:Date,
		default:Date.now,
	},

});
module.exports = mongoose.model("Emoticon",emoticonSchema);  