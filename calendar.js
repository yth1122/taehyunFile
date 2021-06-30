// Require google from googleapis package.
var express = require('express');
var router = express.Router();
const { google } = require('googleapis')
var moment=require('moment');
// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth
var vacationSQL=require('../sql/vacationSQL');
// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '355912080212-f216o2oi8ejn8l4jo2qh5517ph9gr0d6.apps.googleusercontent.com',
  'T82oQb8lODiBywcRYaCA50js'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token: '1//04EOMnKMQcNyLCgYIARAAGAQSNwF-L9IrELcUNudGoZpzu40mPfzEdYPnkjSC5tW7MP4bStANHPe9-wH3FMnFwwpuUI8ZEqMiPBo',
})

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay())

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 1)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)


const getEvents = async (dateTimeStart, dateTimeEnd) => {
    let id;
    try{
      let response = await calendar.events.list({
        calendarId: 'primary',
      });
      let items = response['data']['items'];
      //console.log(items);
      for(let i=0;i<items.length;i++){
        if(moment(items[i].start.dateTime).format('YYYYMMDDHHmm')==dateTimeStart&&
        moment(items[i].end.dateTime).format('YYYYMMDDHHmm')==dateTimeEnd){
              id=items[i].id     
        }
           
      } 
      return id;
    }catch (error) {
      return error;
    }
};

const updateEvents= async (eventId,cal)=>{
    try{ 
      calendar.events.update({
        calendarId:'primary',
        eventId:eventId,
        resource:cal   
      })
      return 'true';
    }catch(error){
      return error;
    }
}

const deleteEvent = async (eventId) => {
    try{
      calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
        });
      return 'true';
    }catch(error) {
      return error;
    }
};     

router.patch('/:start/:end',async function(req,res){
    var event=req.body;
    var start=req.params.start;
    var end=req.params.end;
    let eventId;
    await getEvents(start,end).then(r=>{
        eventId=r; 
        //console.log(r)
    }).catch(function (err){
        res.send(err);
    })   
    if(event.code=='9'||event.code=='11'){
      if(event.stime=='08:30'){
        event.cname='오전 '+event.cname;
      }else if(event.stime=='13:30'){
        event.cname='오후 '+event.cname;  
      }
    }  
    let cal={
      summary:event.uname+' '+ event.cname,
      start:{
        dateTime:moment(event.sdate).format('YYYY-MM-DD')+'T'+event.stime+':00+09:00'
        },
      end:{
        dateTime:moment(event.edate).format('YYYY-MM-DD')+'T'+event.etime+':00+09:00'
        }
    };
    await updateEvents(eventId,cal).then(r=>{
      res.send(r);        
    }).catch(function (err){
      res.status(500).send(err.message);
    });   
})
 
router.delete('/:start/:end',async function(req,res){
    let start= req.params.start;
    let end=req.params.end;
    //console.log(start);
    //console.log(end);
    await getEvents(start, end).then((res) => {
      eventId=res;
      //console.log(res);
    }).catch((err) => {
      res.status(500).send(err);
    });
    await deleteEvent(eventId).then(r=>{
      res.send(r);
    }).catch(function (err){
      res.status(500).send(err.message);
    })  
});
      
router.post('/', async function(req, res) {
   var event=req.body;
   var edate=event.edate;
   var sdate=event.sdate;
   //날짜포맷을 YYYY-MM-DD로 변경
   var e= moment(edate);
   var s= moment(sdate).format('YYYY-MM-DD');
   //console.log(s+'~~'+e);
   let diff=e.diff(s,"days");
   var z; 
   try{
    for(let i=0;i<diff+1;i++){
      if(i==0){
        z=sdate;
      }else{
        z=moment(z).add("1","d").format('YYYYMMDD');
      }
      if(event.code=='9'||event.code=='11'){
        if(event.stime=='08:30'){
           event.cname='오전 '+event.cname;
        }else if(event.stime=='13:30'){
            event.cname='오후 '+event.cname;  
        }
      }
      let cal={
        summary:event.uname+' '+ event.cname,
        start:{
          dateTime:moment(z).format('YYYY-MM-DD')+'T'+event.stime+':00+09:00'
        },
        end:{
          dateTime:moment(z).format('YYYY-MM-DD')+'T'+event.etime+':00+09:00'
        }
      };
      await calendar.events.insert(
       { calendarId: 'primary', resource: cal }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
          console.log('success');
      })
      let data={id:event.id,code:event.code,date:z,stime:event.stime,etime:event.etime,comment:event.comment}
      try{
        vacationSQL.insert(data);
      }catch(err){
        res.send(500).send(err.message);
      };
    }
      res.send('good');
    }catch(err){
      res.status(500).send(err.message);
    }
});
      module.exports = router ;