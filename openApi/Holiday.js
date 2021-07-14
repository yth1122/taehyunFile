var request = require('request');
const convert = require('xml-js');
var express = require('express');
var router = express.Router();
var moment= require('moment');
var holSQL = require('../sql/holidaySQL');
var url = 'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';
var queryParams = '?' + encodeURIComponent('ServiceKey') + '=0XJ8eyV5W7U5SsvXT2F649n5xDohJX6LWGVNT1qZutPSbvx4nJLcMUCKIel4rH1hD5wGPtn%2FJwhqUlt5ERTKzA%3D%3D'; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* */
queryParams += '&' + encodeURIComponent('solYear') + '=' + encodeURIComponent('2021'); /* */
// queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent('02'); /* */
request({
    url: url + queryParams,
    method: 'GET',

}, async function (error, response, body) {
//    console.log('Status', response.statusCode);
    // console.log('Headers', JSON.stringify(body));
    // console.log('Reponse received', body);
    var holi=JSON.parse(convert.xml2json(body,{compact: true, spaces: 4}))
   holi.response.body.items.item.forEach(async i => {
       let format= moment(i.locdate._text).format('YYYY-MM-DD');
    await  holSQL.update({date:format}).then(r=>{
        console.log(r);
    }).catch(function(err){
        console.log(err);
    });
        // console.log(format);     
    });

});

module.exports = router ;