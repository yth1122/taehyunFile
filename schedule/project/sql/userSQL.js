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
    //최종 가공된 데이터를 화면에 띄우기위한 배열
    let b=[];
    //caps_user 의 데이터를 가공하기 위한 for문
    for(let i=0;i<data.length;i++){
        //입사 월,일
        let predate=data[i].date.substr(4,8);  
        let bnum=Number(data[i].bnum);
        let num;
        let date = predate > format1.substr(4,8) ? moment(today).add("-1","y").format('YYYY')+predate : format1.substr(0,4)+predate
        let mindate=moment(date).add("-1","d").format('YYYYMMDD');
        let sdate=date;
        let edate=moment(mindate).add("1","y").format('YYYYMMDD');
        //생성연차
        let test= data[i].date;
        let diff=today.diff(test,"days");
        let difm=today.diff(test,"month");
       //육아휴가 입력값
        if(bnum!='0'){
            num= bnum;   
        }else{//1년 미만자 1달에 1개씩 발생
            if(diff<=Y){
                num=difm;
            }//1년차
            if(Y<diff && diff<=2*Y){
                num=26;
            //1년차는 11개 +15 개로 신입 11개 연차가 이월됨 그래서 범위를 1년 빼서 소진연차 갯수를 구함
              sdate=moment(sdate).add("-1","y").format('YYYYMMDD');
            }
            //2년 이상자 연차생성
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
        //점심시간 사이일 경우 -1시간 ex)08:30~17:30 9시간 - 점심시간 1시간
            if(s2<'1230'&& '1230'<e2){
                min=min -60;
            }//유급 휴가로 연차에서 -되는 것들
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
        //육아기 단축근로자는 연차를 시간단위로 표현
        if(bnum!='0'){
            sum=sum/60;
        }else{//일반 사람들 일수로 표현
            sum=sum/60/8;
        }
        let bal=num-sum
        //계산식 (남은연차/연차소진일까지 남은 시간)/(발생연차/1년(365일)) 
        let ma=-(bal/(today.diff(edate,"hours")/24)) /(num/365)*100;
        //소수점 1자리까지 자르기
        let per=(ma.toFixed(1))+'%';
        //분모가 0이면 무한대(Infinity)값이므로 예외 처리
        if(num=='0'){
            per=' ';
        } //최종 가공하여 화면에 띄울 데이터
        b.push({id:data[i].id,name:data[i].name,num:num,count:sum,bal:bal,edate:edate,per:per,comment:data[i].comment,mdate:data[i].mdate,part:data[i].part,code:data[i].code});    
    }
        return await b;
});