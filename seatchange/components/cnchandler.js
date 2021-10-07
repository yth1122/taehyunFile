import http from './http';
import store from '../src/store';
import axios from 'axios';
class CncHandler {

  constructor() {
    this.stopCode = ["M0", "M00", "M1", "M01","M61", "M62"]
    this.changeTableCode = ["M61", "M62"]
    this.stopRegx = new RegExp("M([0-9]+)");
    this.MIDS={};
    this.filter=[];
    this.state=Number;
    this.retrystart=false;
    this.reconnect=false;
    this.textDecoder = new TextDecoder("utf-8");
  }
  setFilter(ff){
    this.filter =ff;
  }
  requestHandler(fn){
    this.requestHandler=fn;
  };
  setCncList(pp){
    this.processList = pp;
  }
  graphReset(fn){
    this.graphReset = fn;
  }
  graphRefresh(fn){
    this.graphRefresh = fn;
  }
  toolCount(fn){
    this.toolCount=fn;
    this.state=2;
  }
  checkStopCode(value){
    if (value == null || value ==='') return false
    var mcode = this.stopRegx.exec(value)
    if(mcode == null){
      return false
    }else{
      return this.stopCode.includes(mcode[0])
    }
  }
  checkChangeTableCode(value){
    if (value == null || value ==='') return false
    var mcode = this.stopRegx.exec(value)
    if(mcode == null){
      return false
    }else{
      return this.changeTableCode.includes(mcode[0])
    }
  }
  start(){
    var tt = new Date();
    this.timer = tt.getTime();
    this.interval = setInterval(() => {
      for (var cnc in this.MIDS){
        var machine = this.MIDS[cnc];
        if("ACTIVE" === machine.execution &&  machine.pause===false ){
            machine.remainTime-=1000;
        }
      }
      this.timer += 1000;
    }, 1000);
    this.loadCurrentProcess();
  }
  setCurrentTime(n,vm){
    var diff = n.getTime() - this.timer;
      if(diff > 2000){
        vm.$disconnect();
        this.timer = n.getTime();
        this.retrystart=true;
        this.reconnect=false;
        console.log('disconnect start');
      }else if(this.retrystart){
        if(this.reconnect==true && vm.$store.state.socket.isConnected){
          this.retrystart=false;
          this.loadCurrentProcess();
          this.timer = n.getTime();
          console.log('reconnect finish');
        }else{
          if(vm.$store.state.socket.isConnected==false){
            console.log(vm.$store.state.socket.url)
            if(vm.$store.state.socket.url!==''){
              vm.$connect( vm.$store.state.socket.url);
              this.reconnect=true;
              console.log('reconnect start');
            }
          }else{
            console.log('not disconn')
          }
        }
      }
  }
  stop(){
    clearInterval(this.interval);
  }
  filterMachine(mkey){
    if(this.filter.length ===0 ){
      return true;
    }else{
      return this.filter.includes(mkey)
    }
  }
  loadCurrentProcess(){
    http.APIS.get('/api/process/list').then(result =>{
      var index=0;
      this.MIDS={};
      this.processList.length=0;
      result.data.forEach(element => {
        if(!this.filterMachine(element.mkey)){
         return;
        }
        var sindex = this.filter.indexOf(element.mkey);
        if(sindex < 0){
          sindex=index++;
        }
        var process ={};
        process.index = sindex;
        process.processTime = element.active_time ;
        process.processFullTime = element.active ;
        process.waitTime = element.wait;
        process.process = element.process;
        process.part_count = element.process_count;
        process.plan_count = element.plan_count;
        process.startymdt = element.start_ymdt;
        process.mid = element.mid;
        process.mkey = element.mkey;
        process.machineNo = element.machine_no;
        process.lot = element.lot;
        process.pause=false;
        process.changeTablePause=false;
        process.pauseMcode='';
        process.execution=null;
        process.mode=null;

        process.live = {Xload:0,mode:'',path_feedrate:0,position:{x:[],y:[],z:[]}};
        process.modal=[];
        process.currentBlock;
        process.curPosition={x:0,y:0,z:0};
        process.resetGraph=false;
        var remainCount = process.plan_count - process.part_count;
        if(remainCount > 0){
          process.estLotFinishTime = (process.processFullTime ) * remainCount;
        }
        process.remainTime=0;
        this.MIDS[process.mkey] = process;
        this.processList.push(process);   
      });
      this.processList.sort( (a,b)=> a.index - b.index )
      this.loadEdgeStatus();
    }).catch(error=>{
        console.log(error)
    })
  }

  loadEdgeStatus(){
    http.APIS.post('/api/cloud/installedTransmitters',{}).then(result =>{
      store.state.edges=result.data.data;
      result.data.data.forEach(item=>{
        http.EDGE.post('/api/edge/edge_machine_stat',{transmitter:item.id}).then(result =>{
        })
      })
    })
  }
  processExtraPartCount(data){
    var d = data.split("|");
    //var mid = d[3];
    var activeFull =parseInt( d[9]);
    var wait =parseInt( d[10]);
    var active =parseInt( d[11]);
    var partCount = parseInt(d[5]);
    var planCount = parseInt(d[6]);
    var mkey = parseInt(d[13]);
    var remainCount = planCount - partCount;
    var time=parseInt(d[7]);
    if(!this.filterMachine(mkey)){
      return;
    }
    this.MIDS[mkey].waitTime = wait;
    if(remainCount > 0){
      this.MIDS[mkey].estLotFinishTime = (activeFull ) * remainCount;
    }else{
      this.MIDS[mkey].estLotFinishTime =0;
    }
    if(partCount != this.MIDS[mkey].part_count ){
      this.MIDS[mkey].partCountChange=true;
      this.MIDS[mkey].partCountChangeTime=(new Date()).getTime();
    }
    this.MIDS[mkey].part_count = partCount;
    this.MIDS[mkey].plan_count = planCount;
    this.MIDS[mkey].processTime = active;
    this.MIDS[mkey].remainTime =  0;
    this.MIDS[mkey].pause=false;
    this.MIDS[mkey].pauseMcode=''
    if(this.graphRefresh!=undefined){
      this.graphRefresh(mkey,time,wait);
    }

  }
    listenWebSocketResponse(  ){
    return (data) => {
      if(data.data.constructor.name === 'Blob'){
        var r = URL.createObjectURL(data.data);
        fetch(r).then(res => res.arrayBuffer()).then(r=>{
          var a = this.textDecoder.decode(r);
            if(a.indexOf("EXTRA|PART_COUNT")==0){
              this.processExtraPartCount(a);
            }
            URL.revokeObjectURL(r);
        })
      }else{
        var resp = JSON.parse(data.data)
        if(resp.response ==="EDGE_MACHINES_STAT"){
            this.processEdgeMachineStat(resp.data);
        }else if(resp.response ==="RELOAD_PAGE"){
          location.reload(true);
        }else if(resp.response=="CALL_FUNC_RESULT"){
            this.requestHandler(resp);
        }
      
      }
    }
  }
  processCNCData(data){
    var d = data.split("|");
    var mkey = parseInt(d[2]);
    if(!this.filterMachine(mkey)){
      return;
    }
    for(var i = 4 ; i < d.length;i=i+2){
        if(d[i]==""){
          console.log(data);
        }
        this.MIDS[mkey].live[d[i]] = d[i+1];
        if(d[i]==='block'){
          this.MIDS[mkey].modal.push({time:d[3],block:d[i+1]});
          this.MIDS[mkey].currentBlock = d[i+1].trim();
          if(this.MIDS[mkey].modal.length > 12){
            this.MIDS[mkey].modal.shift();
          }
          if(this.MIDS[mkey].resetGraph){
            this.MIDS[mkey].live.position.x.length=0;
            this.MIDS[mkey].live.position.z.length=0;
            this.MIDS[mkey].live.position.y.length=0;
            this.MIDS[mkey].modal.length=0;
            this.MIDS[mkey].resetGraph=false;
            if(this.graphReset!==undefined){
              this.graphReset(mkey);
            }
          }
        }else if(d[i] =="path_position"){
          var xyz = d[i+1].split(" ");
          var x= parseFloat(xyz[0]);
          var y= parseFloat(xyz[1]);
          var z= parseFloat(xyz[2]);

          //if(z<50){
            this.MIDS[mkey].curPosition.x=x;
            this.MIDS[mkey].curPosition.y=y;
            this.MIDS[mkey].curPosition.z=z;
            this.MIDS[mkey].live.position.x.push(x);
            this.MIDS[mkey].live.position.z.push(z);
            // if(this.graphRefresh!==undefined){
            //   this.graphRefresh(mkey,x,y,z);
            //   //this.drawFn(mkey,x,y,z);
            // }
          //}
        }
    }
  }
  processEdgeMachineStat(data){
    data.forEach( data=>{
            var mid = data.Mid;
            var mkey = parseInt(data.Id);
            if(!this.filterMachine(mkey)){
              return;
            }
             
            if(this.MIDS[mkey]==undefined){
              var process ={};
              var sindex = this.filter.indexOf(mkey);
              if(sindex < 0){
                sindex=this.processList.length+1;
              }
              process.index = sindex;
              process.processTime = 0 ;
              process.processFullTime = 0 ;
              process.waitTime = 0;
              process.process = '';
              process.part_count = 0;
              process.plan_count = 0;
              process.startymdt = 0;
              process.mid = mid;
              process.mkey = mkey;
              process.lot = 0;
              process.pause=false;
              process.changeTablePause=false;
              process.pauseMcode='';
              process.execution=null;
              process.mode=null;
              process.live = {Xload:0,mode:'',path_feedrate:0,position:{x:[],y:[],z:[]}};
              process.modal=[];
              process.currentBlock;
              process.curPosition={x:0,y:0,z:0};
              process.resetGraph=false;
              var remainCount = process.plan_count - process.part_count;
              if(remainCount > 0){
                process.estLotFinishTime = (process.processFullTime ) * remainCount;
              }
              process.remainTime=0;
              this.MIDS[process.mkey] = process;
              this.processList.push(process);
            }
            this.processList.sort( (a,b)=> a.index - b.index )
            var execution = data.Execution;
            var partCount = data.PartCount;
            var planCount = data.PlanCount;
            var activeStartTime= data.ActiveTime;
            var partCountChangeTime= data.CountTime;

            var workTime= data.WorkTime;
            var tactiveTime = data.TActiveTime;
            var block = data.Block;

            var sendByte = data.SendByte;
            if(data.Estop == "TRIGGERED"){
              execution = "TRIGGERED";
            }
            if(data.Power==false){
              execution = "POWER_OFF";
            }
            var _remainCount = planCount - partCount;
            if(_remainCount > 0){
                this.MIDS[mkey].estLotFinishTime  = (this.MIDS[mkey].processFullTime) * _remainCount;
            }else{
              this.MIDS[mkey].estLotFinishTime=0;
            }
            var lastPart = this.MIDS[mkey].part_count;
            this.MIDS[mkey].activeStartTime = activeStartTime;
            this.MIDS[mkey].partCountChangeTime = partCountChangeTime;
            this.MIDS[mkey].process = block;
            this.MIDS[mkey].execution = execution;
            this.MIDS[mkey].message = data.Message;
            this.MIDS[mkey].mode = data.Data.mode;
            this.MIDS[mkey].part_count = partCount;
            this.MIDS[mkey].plan_count = planCount;
            var dt = new Date();
            if(this.checkStopCode( data.Data.block )){
              this.MIDS[mkey].pause = true;
              this.MIDS[mkey].pauseMcode=data.Data.block;
              if(this.checkChangeTableCode( data.Data.block )){
                this.MIDS[mkey].changeTablePause = true;
              }
            }
            if(workTime > 0){
              if(tactiveTime > 0){
                this.MIDS[mkey].remainTime =  this.MIDS[mkey].processTime  -   workTime  - (dt.getTime() - tactiveTime );
              }else{
                this.MIDS[mkey].remainTime =  this.MIDS[mkey].processTime - workTime;
              }
            }else{
              this.MIDS[mkey].remainTime=this.MIDS[mkey].processTime - (dt.getTime() - activeStartTime );
            }
            if(partCountChangeTime >  activeStartTime || lastPart < partCount ){
              this.MIDS[mkey].partCountChange=true;
            }else{
              this.MIDS[mkey].partCountChange=false;
            }
            this.MIDS[mkey].sendbyte = sendByte;
    });
  }
}

export default new CncHandler;

