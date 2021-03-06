'use strict'
var mysql  = require('../conf/db.js');
const mybatisMapper = require('mybatis-mapper');
var format = {language: 'sql', indent: '  '};
var moment=require('moment');


module.exports.search =  mysql.simpleQuery( async (con,keyword)=>{
    mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','SEARCH',keyword, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.readm = mysql.simpleQuery( async (con,id)=>{
    mybatisMapper.createMapper(['./db/mapper/UserMapper.xml']);
    var query = mybatisMapper.getStatement('USER','READM',id,format);
    console.log(query);
    return await con.query(query);
});

module.exports.use = mysql.simpleQuery( async (con,no)=>{
    mybatisMapper.createMapper(['./db/mapper/UserMapper.xml']);
    var query = mybatisMapper.getStatement('USER','USE',no,format);
    console.log(query);
    return await con.query(query);
});

module.exports.notb =  mysql.simpleQuery( async (con,id)=>{
    //mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','NOTB',id, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.date =  mysql.simpleQuery( async (con,id)=>{
    mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','DATE',id, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.name =  mysql.simpleQuery( async (con,email)=>{
    mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','NAME',email, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.read =  mysql.simpleQuery( async (con,no)=>{
    mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','READ',no, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.bnum =  mysql.simpleQuery( async (con,id)=>{
    mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','BNUM',id, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.setb =  mysql.simpleQuery( async (con,keyword)=>{
    mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','SETB',keyword, format);  
    console.log(query); 
    return await con.query(query);
});

module.exports.dateall =  mysql.simpleQuery( async (con)=>{
    mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
    var query =  mybatisMapper.getStatement('USER','DATEALL', format);  
    console.log(query);
    let data= await con.query(query);
    //console.log(data);
    const Y='365';
    let today= moment();
    let format1=today.format('YYYYMMDD');
    //?????? ????????? ???????????? ????????? ??????????????? ??????
    let b=[];
    //caps_user ??? ???????????? ???????????? ?????? for???
    for(let i=0;i<data.length;i++){
        //?????? ???,???
        let predate=data[i].date.substr(4,8);  
        let bnum=Number(data[i].bnum);
        let num;
        let date = predate > format1.substr(4,8) ? moment(today).add("-1","y").format('YYYY')+predate : format1.substr(0,4)+predate
        let mindate=moment(date).add("-1","d").format('YYYYMMDD');
        let sdate=date;
        let edate=moment(mindate).add("1","y").format('YYYYMMDD');
        //????????????
        let test= data[i].date;
        let diff=today.diff(test,"days");
        let difm=today.diff(test,"month");
       //???????????? ?????????
        if(bnum!='0'){
            num= bnum;   
        }else{//1??? ????????? 1?????? 1?????? ??????
            if(diff<=Y){
                num=difm;
            }//1??????
            if(Y<diff && diff<=2*Y){
                num=26;
            //1????????? 11??? +15 ?????? ?????? 11??? ????????? ????????? ????????? ????????? 1??? ?????? ???????????? ????????? ??????
              sdate=moment(sdate).add("-1","y").format('YYYYMMDD');
            }
            //2??? ????????? ????????????
            if(2*Y<diff && diff<=3*Y){
                num=15; 
            }
            if(3*Y<diff && diff<=5*Y){
                num=16; 
            }
            if(5*Y<diff && diff<=7*Y){
                num=17;
            }
            if(7*Y<diff && diff<=9*Y){
                num=18; 
            }
            if(9*Y<diff && diff<=11*Y){
                num=19; 
            }
            if(11*Y<diff && diff<=13*Y){
                num=20; 
            }
            if(13*Y<diff && diff<=15*Y){
              num=21;  
            }
            if(15*Y<diff && diff<=17*Y){
              num=22;  
            }
            if(17*Y<diff && diff<=19*Y){
              num=23;
            }
            if(19*Y<diff && diff<=21*Y){
                num=24; 
            }  
            if(21*Y<diff){
                num=25;
            }
        }    
        mybatisMapper.createMapper([ './db/mapper/UserMapper.xml' ]);
        var query1 =  mybatisMapper.getStatement('USER','USE',{id:data[i].id,sdate:sdate,edate:edate},format);
        let z=await con.query(query1);
        let da=today.format('YYYY-MM-DD');
        let sum=0;
        
        for(let j=0; j<z.length;j++){
            let code=z[j].code;
            let s1=da+' '+z[j].stime;
            let e1=da+' '+z[j].etime;
            let s2=z[j].stime.replace(/:/gi, "");
            let e2=z[j].etime.replace(/:/gi, "");
            let min=moment(e1).diff(s1,"minutes");
            //console.log(z[j]);
        //???????????? ????????? ?????? -1?????? ex)08:30~17:30 9?????? - ???????????? 1??????
            if(s2<'1230'&& '1230'<e2){
                min=min -60;
            }//?????? ????????? ???????????? -?????? ??????
            if(code=='1'||code=='2'||code=='9'||code=='10')  {     
                if(z[j].comment.indexOf('#')==-1){
                    sum=sum+min;
                }else if(z[j].comment.indexOf('#')!=-1){
                    if(sdate<z[j].date&&z[j].date<edate){
                        sum=sum+min;
                        console.log('gg');
                    }    
                }
            }
        } 
        //????????? ?????????????????? ????????? ??????????????? ??????
        if(bnum!='0'){
            sum=sum/60;
        }else{//?????? ????????? ????????? ??????
            sum=sum/60/8;
        }
        let bal=num-sum
        //????????? (????????????/????????????????????? ?????? ??????)/(????????????/1???(365???)) 
        let ma=-(bal/(today.diff(edate,"hours")/24)) /(num/365)*100;
        //????????? 1???????????? ?????????
        let per=(ma.toFixed(1))+'%';
        //????????? 0?????? ?????????(Infinity)???????????? ?????? ??????
        if(num=='0'){
            per=' ';
        } //?????? ???????????? ????????? ?????? ?????????
        b.push({id:data[i].id,name:data[i].name,num:num,count:sum,bal:bal,edate:edate,per:per,comment:data[i].comment,mdate:data[i].mdate,part:data[i].part,code:data[i].code});    
    }
        return await b;
});