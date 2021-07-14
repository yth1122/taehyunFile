'use strict'
var mysql  = require('../conf/db.js');
const mybatisMapper = require('mybatis-mapper');
var format = {language: 'sql', indent: '  '};
var moment=require('moment');

module.exports.list =  mysql.simpleQuery( async (con,val)=>{
    mybatisMapper.createMapper([ './db/mapper/VacationMapper.xml' ]);
    var query =  mybatisMapper.getStatement('VACATION','LIST',val,format);  
    console.log(query); 
    return await con.query(query);  
});

module.exports.insert =  mysql.transaction( async (con,keyword)=>{
    var edate=keyword.edate;
    var sdate=keyword.sdate;
    //날짜포맷을 YYYY-MM-DD로 변경
    var e= moment(edate);
    var s= moment(sdate).format('YYYY-MM-DD');
    //console.log(s+'~~'+e);
    let diff=e.diff(s,"days");
    let z;
    for(let i=0;i<diff+1;i++){
        if(i==0){
            z=sdate;
        }else{
            z=moment(z).add("1","d").format('YYYYMMDD');
        }
        mybatisMapper.createMapper([ './db/mapper/VacationMapper.xml' ]);      
        var query =  mybatisMapper.getStatement('VACATION','INSERT',{id:keyword.id,code:keyword.code,date:z,stime:keyword.stime,etime:keyword.etime,comment:keyword.comment}, format);
        console.log(query); 
        await con.query(query); 
    } 
    return true;
});

module.exports.delete =  mysql.simpleQuery( async (con,no)=>{
    mybatisMapper.createMapper([ './db/mapper/VacationMapper.xml' ]);
    var query =  mybatisMapper.getStatement('VACATION','DELETE',no, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.update =  mysql.simpleQuery( async (con,keyword)=>{
    mybatisMapper.createMapper([ './db/mapper/VacationMapper.xml' ]);
    var query =  mybatisMapper.getStatement('VACATION','UPDATE',keyword, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.read = mysql.simpleQuery( async (con,val)=>{
    mybatisMapper.createMapper(['./db/mapper/VacationMapper.xml']);
    var query = mybatisMapper.getStatement('VACATION','READ',val,format);
    console.log(query);
    return await con.query(query);
});

module.exports.bigo =  mysql.simpleQuery( async (con,keyword)=>{
    mybatisMapper.createMapper([ './db/mapper/VacationMapper.xml' ]);
    var query =  mybatisMapper.getStatement('VACATION','BIGO',keyword, format);  
    console.log(query); 
    return await con.query(query);
});

