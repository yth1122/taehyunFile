var express = require('express');
var router = express.Router();
var userSQL = require('../sql/userSQL')
var moment=require('moment');
//근태관련
router.post('/', function(req, res) {
    var keyword =req.body;
    if(req.body.name){
        keyword.name='%'+keyword.name+'%';
    }else{
        keyword.name='%';
    }
    if(req.body.type){
        keyword.type='%'+keyword.type+'%';
    }
    keyword.sdate=keyword.sdate.replace(/-/gi, "");
    if(req.body.edate){
        keyword.edate=keyword.edate.replace(/-/gi, "")+'235959';
    }else {keyword.edate='9'}
    userSQL.search(keyword).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});
//사람별 연차정보 전부
router.get('/dateall',async function(req,res){
    await userSQL.dateall().then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    })
});

router.patch('/', function(req, res) {
    var keyword =req.body;
    userSQL.setb(keyword).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});

router.patch('/:id', function(req, res) {
    var id =req.params;
    userSQL.notb(id).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});

router.get('/readm/:id',function( req,res){
    var id=req.params; 
    userSQL.readm(id).then(r=>{
        res.send(r);
    }).catch(function (err){
       res.status(500).send(err.message)
    })
});

router.get('/bnum/:id',function( req,res){
    var id=req.params; 
    userSQL.bnum(id).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    })
});

router.get('/name/:email', function( req,res){
    var email=req.params;
    userSQL.name(email).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    })
});

router.get('/read/:no', function( req,res){
    var no=req.params;
    userSQL.read(no).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    })
});

router.get('/date/:id', async function(req, res) {
    const Y='365';
    var id=req.params;
    //diff 함수쓸때 필요한 형식 
    let today= moment();
    //table날짜와 비교하기위해 'YYYYMMDD'
    let format=today.format('YYYYMMDD');
    userSQL.date(id).then(r=>{
        let rid=r[0].id;
        //입사 월,일
        let predate=r[0].date.substr(4,8);  
        let date = predate > format.substr(4,8) ? moment(today).add("-1","y").format('YYYY')+predate : format.substr(0,4)+predate
        let mdate=moment(date).add("-1","d").format('YYYYMMDD');
        let edate=moment(mdate).add("1","y").format('YYYYMMDD');
        res.send({id:rid,edate:edate,sdate:date});
    }).catch(function (err){
        res.status(500).send(err.message)
    })   
});

router.get('/:id/:sdate/:edate',function(req,res){
    no=req.params;
    userSQL.use(no).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)////
    })
})
  
router.get('/:id', async function(req, res) {
    const Y='365';
    var id=req.params;
    //diff 함수쓸때 필요한 형식 
    let today= moment();
    //table날짜와 비교하기위해 'YYYYMMDD'
    let format=today.format('YYYYMMDD');
    userSQL.date(id).then(r=>{
        let rid=r[0].id;
        let bnum=r[0].bnum;
        //입사월일 가져옴
        let predate=r[0].date.substr(4,8);  
        //연차시작일
        let date = predate > format.substr(4,8) ? moment(today).add("-1","y").format('YYYY')+predate : format.substr(0,4)+predate
        let mdate=moment(date).add("-1","d").format('YYYYMMDD');
        let edate=moment(mdate).add("1","y").format('YYYYMMDD');
        //생성연차
        let num;
        let test= r[0].date;
        let diff=today.diff(test,"days");
        let difm=today.diff(test,"month");
        //육아휴직 연차생성 관리자 직접입력
        if(bnum!='0'){
            num= bnum;   
        }else{//1년 미만자 1달에 1개씩 발생
            if(diff<Y){
                num=difm;
            }//1년차
            if(Y<=diff && diff<=2*Y){
                num=26;
            //1년차는 11개 +15 개로 신입 11개 연차가 이월됨 그래서 범위를 1년 빼서 소진연차 갯수를 구함
                date=moment(date).add("-1","y").format('YYYYMMDD');
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
        userSQL.use({id:rid,sdate:date,edate:edate}).then(r=>{
            let da=today.format('YYYY-MM-DD');
            let sum=0;
            //console.log(r);
            for(let k=0; k<r.length;k++){
                let code=r[k].code;
                let s1=da+' '+r[k].stime;
                let e1=da+' '+r[k].etime;
                let s2=r[k].stime.replace(/:/gi, "");
                let e2=r[k].etime.replace(/:/gi, "");
                let hours=moment(e1).diff(s1,"minutes");0
                //점심시간 사이일 경우 -1시간
                if(s2<'1230'&& '1230'<e2){
                    hours=hours -60;
                }
                if(code=='1'||code=='2'||code=='9'||code=='10')  {     
                    if(r[k].comment.indexOf('#')==-1){
                        sum=sum+hours;
                    }else if(r[k].comment.indexOf('#')!=-1){
                        if(date<r[k].date && r[k].date<edate){
                            //console.log(date,edate);
                            sum=sum+hours;           
                        }

                    }
                }
            } 
              //천과장님은 시간단위로 표현
            if(bnum!='0'){
                sum=sum/60;
            }else{
                sum=sum/8/60;
            }
            let bal=num-sum;
            //계산식
            let ma=-(bal/(today.diff(edate,"hours")/24)) /(num/365)*100;
            //소수점 1자리까지 자르기
            let per=(ma.toFixed(1))+'%';
            //분모가 0이면 무한대이므로 예외 처리
            if(num=='0'){
                per=' ';
            } 
            res.send({num:num,count:sum,bal:bal.toFixed(2),edate:edate,per:per});
        }).catch(function (err){
          res.status(500).send(err.message)
        })   
    }).catch(function (err){
      res.status(500).send(err.message)
    }) 
});





module.exports = router ;