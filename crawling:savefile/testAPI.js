var express = require('express');
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
var fs = require('fs');
router.get('/',async function(req,res){
	const getHtml = async () => {
		try {
		  return await axios.get("http://egloos.zum.com/metalbear/v/3521684");
		} catch (error) {
		  console.error(error);
		}
	  };
	  getHtml()
	  .then(async html => {
		let ulList = [];
		let array = [];
		const $ = cheerio.load(html.data);
		ulList=$("div.post");
		for(let i=0; i<ulList[0].children.length;i++){
			if(ulList[0].children[i].data){
				array[i]=ulList[0].children[i].data;
			}	
		}
		let data = await array.toString();
		data=data.split(',,').toString();
		fs.writeFile('mysql.txt',data,(err,data)=>{
			if(err){
				console.log(err)
			}else{
				console.log('download success');
			}
		})
		res.send(data);	
	})
		 
})



  module.exports= router;
