<template>
  <div id="popup">
    <!-- 연차 신청 팝업 -->
    
    <div id="submit_dayoff" class="popup_body" v-if="show == 'submit_dayoff'">
      <form action="submit" name="submit_dayoff" >
        <div class="applicant popup_block">
          <label for="applicant" class="title">신청자</label>
          <p class="cont">

            <!-- 이름이 박혀서 들어갈 경우 -->
            <!-- <input type="text" id="applicant" value="신청자" readonly> -->
            <!-- 관리자일 경우 -->
            <select name="applicant" v-model="form.id"
                @change="g(form.id)" id="applicantSelect" class="applicantSelect" >
              <option 
                  v-for="app in applicantData"
                  :key="'applicant' + app.value"
                  :value="app.value"
                  
              >
                {{app.name}}
              </option>
            </select>

          </p>
        </div>

        <div class="type popup_block">
          <label class="title">구분</label>
          <div class="cont">
            <v-radio-group v-model="typeModel">
              <v-radio
                v-for="item in dayoffType" :key="'type_' + item.class" class="cm_check_item"
                :label="item.name"
                :value="item.value"
                @click='getname(item.name)'
              >
              </v-radio>
            </v-radio-group>
          </div>
        </div>

        <div class="type_detail popup_block">
          <label class="title">기간</label>
          <div class="cont">

            <div id="period" class="period">
              <input type="date" v-model="form.sdate" class="startPeriod">

              <template v-if="!dayoffFormType.includes('onlyDay')">
                <span class="gap">~</span>
                <input 
                  id="endPeriod" type="date" class="endPeriod" 
                  v-model="form.edate"
                >
              </template>
            </div>
            
            <div id="time" class="time" v-if="dayoffFormType.includes('time')">
              <v-radio-group v-model="timeModel">
                <v-radio class="cm_check_item am" label="오전" value="AM"></v-radio>
                <v-radio class="cm_check_item pm" label="오후" value="PM"></v-radio>

                <template v-if="valueToClass[typeModel] == 'menstrual'">
                  <v-radio class="cm_check_item all_day" label="종일" value="allDay"></v-radio>
                  <v-radio class="cm_check_item write" label="직접기입" value="write"></v-radio>
                </template>

              </v-radio-group>
            </div>

            <div id="hour" class="hour" v-if="dayoffFormType.includes('hour')">
              <input type="time" v-model="form.stime" class="startHour" :readonly="isHourReadonly" >
              <span class="gap">~</span>
              <input type="time" v-model="form.etime" class="endHour" :readonly="isHourReadonly" :min="this.form.stime">
            </div>

          </div>
        </div>
        

        <div class="reason popup_block">
          <label for="reason" class="title">사유</label>
          <div class="cont" >
            <input id="reason" type="text" v-model="form.comment" class="reason_text" required >
          </div>
        </div>

          <div 
          class="left_dayoff_info popup_block" 
          v-for="(item, index) in data2"
          :key="'left_dayoff_info_' + index"
        >
          <label for="left_dayoff_info" class="title">남은 연차</label>
          <div class="cont">
            <div class="small_tag quantity">
              <p class="cm_pale_tag">개수</p>
              <div class="info">{{ item.num }}</div>
            </div>
            <div class="small_tag deadline">
              <p class="cm_pale_tag">소진일</p>
              <div class="info">{{ item.edate }}</div>
            </div>
            <div class="small_tag day_per_dayoff">
              <p class="cm_pale_tag">일수대비</p>
              <div class="info"> {{ item.per }} 남음</div>
            </div>
          </div>
        </div>
        


        <div class="submit">
          <p class="submit_date"></p>
          <input type="button" @click="submit" @close="dialogInsert=false" value="제출" class="dayoff_form_submit">
        </div>

      </form>
    </div>
   
    <!-- 연차 신청 제풀 시 확인 팝업 / 제출하시겠습니까? -->
    <div id="check_submit_dayoff" class="popup_body popup_check" v-if="show == 'check_submit_dayoff'">
      <div class="content">
        <p class="title">제출하시겠습니까?</p>
      </div>
      <input type="button" class="popup_btn check_btn blue" value="확인">
    </div>
    
    <!-- 연차 삭제 팝업 / 정말 삭제 하시겠습니까? -->
    <div id="check_delete_dayoff" class="popup_body popup_check" v-if="show == 'check_delete_dayoff'">
      <div class="content">
        <div class="text">
          <span class="info bold" >{{data[0].name}} {{format(data[0].date)}} {{data[0].cname}}</span><br>
          정말 <span class="bold">삭제</span> 하시겠습니까?
        </div>
      </div>
      <input type="button" class="popup_btn delete_btn red" value="삭제" @click="check_delete_close">
    </div>

    <!-- 연차 수정 팝업 -->
    <div id="modify_dayoff" class="popup_body" v-if="show == 'modify_dayoff'">
      <div class="content">

          <div class="army_deadline popup_block">
            <label for="remark" class="title">군복무 만기일</label>
            <div class="cont">
              <label class="cm_check_item isSoldier">
                <input type="checkbox" id="soldier" :checked="checked" @change="changeIsSoldier">
                <span class="text">군복무자</span>
              </label>
              <input type="date" v-model="form1.mdate" class="armyEndDate" :disabled="isSoldier">
            </div>
          </div>

            <div class="remark popup_block">
              <label for="remark" class="title">비고</label>
              <div class="cont">
                <textarea name="remark" v-model="form1.comment" id="remark" class="remark_text">
                </textarea>
              </div>
            </div>

      </div>

      <input type="button" class="popup_btn delete_btn yellow" value="수정완료" @click="modify_dayoff_close">

    </div>
  </div>
</template>


<script>
import moment from 'moment'
export default {
  name: 'popup',
  props: [
    'show',
    'data3',
    'no',
    'id',
    'mdata',
    'email',
  ],
  data() {
    return {
        applicantData: [],
        dayoffType: [],
        copyDayoff:[ { name: '연차', class: 'dayoff', value: 1},
            { name: '반차', class: 'halfDay', value: 9,},
            { name: '생리휴가', class: 'menstrual', value: 11,},
            { name: '시간차', class: 'timeDayoff', value: 2,},
            { name: '병가', class: 'sick', value: 3,},
            { name: '결근', class: 'absence', value: 5,},
            { name: '경조사', class: 'bereavment', value: 6,},
            { name: '육아휴가', class: 'childcare', value: 8,},
            { name: '출산휴가', class: 'maternity', value: 7,},
            { name: '공가', class: 'official', value: 4,},],
        data2:[],
        data:[{name:'',date:'',cname:''}],
        dayoffFormType: 'period',
        dayoffFormTypeDetail: {
            dayoff: [],
            halfDay: ['time','onlyDay'],
            menstrual: ['time','allDay','hour', 'onlyDay'],
            timeDayoff: ['hour', 'onlyDay'],
            sick: ['hour'],
            absence: ['hour'],
            bereavment: [],
            childcare: [],
            maternity: [],
            official: [],
        },
        form:{},
        form1:{},
        isHourReadonly: true,
        isSoldier: true,
        checked:false,
        typeModel: 1,
        timeModel: 'write',
        valueToClass: [],
        dialogInsert: false,
    };
  },
  mounted: async function() {
      this.form.sdate=moment().format('YYYY-MM-DD');
      this.val=this.form.sdate;
      this.form.comment="개인 사유";
      let forValueToClass = [];
      this.form.cname='연차';
    
      this.copyDayoff.forEach(function(value) {
          forValueToClass[value.value] = value.class;
      })
      this.valueToClass = forValueToClass;
      await this.axios.get('http://192.168.0.154:3001/yhs/user/dateall').then(r=>{
          for(let i=0;i<r.data.length;i++){
          //lee.jaemin@yhsbearing.com
          //yoon.taehyun@yhsbearing.com
          //jin.hanbyeol@yhsbearing.com
              if(this.$store.state.user.email=='lee.jaemin@yhsbearing.com'){
                  if(r.data[i].code=='2'){
                      this.applicantData.push({name:r.data[i].name,value:Number(r.data[i].id),code:r.data[i].code})
                  }
              }else{
                  this.applicantData.push({name:r.data[i].name,value:Number(r.data[i].id),code:r.data[i].code})
              }
          }
      });
      await this.axios.get('http://192.168.0.154:3001/yhs/user/name/'+this.$store.state.user.email).then(r=>{
          if(this.$store.state.user.email=='lee.jaemin@yhsbearing.com'){
              this.form.id=r.data[0].id;  
              this.applicantData.push({name:r.data[0].name,value:r.data[0].id});
          }else if(this.$store.state.user.email=='jin.hanbyeol@yhsbearing.com'){
                this.form.id=r.data[0].id  
          }else{
              this.form.id=r.data[0].id;  
              this.applicantData=[];
              this.applicantData.push({name:r.data[0].name,value:r.data[0].id});
          }
          if(r.data[0].gender=='M'){
              this.dayoffType=this.copyDayoff;
              this.dayoffType.splice(2,1);
              this.dayoffType.splice(7,1);
              }else if(r.data[0].gender=='WM'){
              if(this.$store.state.user.email=='jin.hanbyeol@yhsbearing.com'){
                this.dayoffType=this.copyDayoff;
              }else{  
              this.dayoffType=this.copyDayoff;
              this.dayoffType.splice(9,1);
              }
          }
      })
      await this.axios.get('http://192.168.0.154:3001/yhs/user/'+this.form.id).then(r=>{
          r.data.edate=this.format(r.data.edate);
          this.data2.push({num:r.data.num,edate:r.data.edate,per:r.data.per}) 
      })
      await this.g(this.form.id);
  },
  methods: {
      changeIsSoldier: function(event) {
          this.isSoldier = !event.target.checked;
          this.form1.mdate=null;
      },
      async submit(){
          this.form.sdate=moment(this.form.sdate).format('YYYYMMDD');
          this.form.edate=moment(this.form.edate).format('YYYYMMDD')
          this.form.code=this.typeModel;
          if(this.form.comment==undefined){
              this.form.comment=' ';
          }
          if(this.form.code=='1'||this.form.code=='4'||this.form.code=='6'||this.form.code=='7'||this.form.code=='8'){
              this.form.stime='08:30';
              this.form.etime='17:30';
          }
          if(this.form.code=='9'|| this.form.code=='2'||this.form.code=='11'){
              this.form.edate=this.form.sdate;
              if(this.form.stime=='08:30' && this.form.etime=='13:30'){
                  this.form.cname='오전 '+this.form.cname;
              }else if(this.form.stime=='13:30' && this.form.etime=='17:30'){
                  this.form.cname='오후 '+this.form.cname;
              }        
          }
          let st=this.form.stime.replace(':','');
          let et=this.form.etime.replace(':','');
          let fdate;
          let fdate1;
          if(this.data3==undefined){
              await this.axios.post("http://192.168.0.154:3001/yhs/vac/",this.form).then(r=>{
                  this.$emit('close');
                  this.$emit('calendar');  
              })
              if(this.form.comment.indexOf('#')!=-1){
                      fdate= moment(this.form.comment.substr(1,10)).format('YYYYMMDD');
                      fdate1=fdate;
                      console.log(fdate);
                  }else{
                      fdate=this.form.sdate;
                      fdate1=this.form.edate;
                  } 
              window.open("https://calendar.google.com/calendar/u/0/r/eventedit?text="+this.form.uname+"%20"+this.form.cname+"&dates="+fdate+"T"+st+"00009%2F"+fdate1+"T"+et+"00009", "_blank"); 
          }else{
              this.form.no=this.no;
              this.form.date=this.form.sdate;
              await this.axios.patch("http://192.168.0.154:3001/yhs/vac/",this.form).then(r=>{
                  this.modi();
              })
          }
          this.typeModel=1;
          this.form.sdate=moment().format('YYYY-MM-DD');
          this.form.edate=moment().format('YYYY-MM-DD');
      },
      async check_delete_close() {
          await this.axios.delete('http://192.168.0.154:3001/yhs/vac/'+this.no).then(r=>{})
          await this.$emit('close');
          await this.$emit('calendar');
          await this.$emit('reset');
      },
      modify_dayoff_close() {
          this.form1.id=this.id
          this.axios.patch('http://192.168.0.154:3001/yhs/vac/bigo',this.form1).then(r=>{
              this.$emit('close');
              this.$emit('datea');
        })
      },
      async modi(){
          await this.$emit('close');
          await this.$emit('vacStatus');
          await this.$emit('uservac');
          await this.$emit('calendar');    
          await this.$emit('reset');
      },
      format(val){
          val= moment(val).format('YYYY-MM-DD');
          return val;
      },
      getname(val){
          this.form.cname=val;
      },
      g(val){
          this.axios.get('http://192.168.0.154:3001/yhs/user/bnum/'+val).then(r=>{
              this.form.uname=r.data[0].name;
              //console.log(this.form.uname);
          })
      },
    },
  //2021-03-23
  watch: {
      typeModel: function(val) {
          let type = this.valueToClass[val];
          let detail = this.dayoffFormTypeDetail[type];
          // set, reset
          this.dayoffFormType = detail;
          this.isHourReadonly = false;
          // 생차일 경우
          if(this.data3==undefined){
              if( type == 'menstrual' ) {
                  this.isHourReadonly = true;
                  this.timeModel = "allDay";
              }else {
                  this.isHourReadonly = false;
                  this.timeModel = "AM";
              }
          }
      },
      timeModel: function(val) {
          // let list = this.dayoffFormTypeDetail.menstrual;  
          let type = this.valueToClass[this.typeModel];
          // 생차인데, 타임을 변경하는 경우
          if( type == 'menstrual' ) {
              if( val == 'allDay') {
                  this.form.stime='08:30';
                  this.form.etime='17:30';
                  this.isHourReadonly=true;
                  return;
              }else if( val == 'write' ){
                  this.isHourReadonly=false;
              }
          }
          if(val == 'AM' ){
              this.form.stime='08:30';
              this.form.etime='13:30';
              this.isHourReadonly=true;
          }else if( val=='PM' ){
              this.form.stime='13:30';
              this.form.etime='17:30';
              this.isHourReadonly=true;
          }
      },
      data3: function(val){
          //console.log(this.data3);
          this.data=this.data3;
          this.g(val[0].id);
          this.form={};
          this.form.id=val[0].id;
          this.form.cname=val[0].cname;
          if(val[0].comment.indexOf('#')!=-1){
              let i=this.format(val[0].comment.substr(1,10));
              this.form.sdate=i;
              this.data[0].date=i;
          }else{
              this.form.sdate=this.format(val[0].date);
          }
          this.typeModel=Number(val[0].code);
          this.form.edate=this.form.sdate;
          this.form.stime=val[0].stime;
          this.form.etime=val[0].etime;
          this.form.comment=val[0].comment;
          if(this.typeModel == 9|| this.typeModel==11 ){
              if(this.form.stime=='08:30' && this.form.etime=='13:30'){
                  this.timeModel='AM';
              }else if(this.form.stime=='13:30' && this.form.etime=='17:30'){
                  this.timeModel='PM';
              }else if(this.fomr.stime=='08:30'&& this.form.etime=='17:30'){
                  this.timeModel='allDay';
              }
          }
         
          
      },
      mdata: function(val){
          this.form1={};
          this.form1.mdate=val[0].mdate;
          this.form1.comment=val[0].comment;
          if(val[0].mdate!=null){
              this.isSoldier=false;
              this.checked=true;
          }else{
              this.isSoldier=true;
              this.checked=false;
          }
          if(this.checked==true){
              this.isSolider=false;
          }
      },
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";
  #popup {
    .popup_body {
      display: flex;
      min-height: 270px;
      padding: 32px;
      border-radius: 8px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
      position: relative;
      background: white;
    }
  }
  // 연차 신청 팝업
  // #submit_dayoff { display: none; }
  .popup_block {
    @extend .cf;

    margin-bottom: 24px;

    .title {
      width: 180px;
      float: left;
      border-left: 4px solid $m_blue;
      padding: 3px 0 1px 8px;
      color: $m_blue;
      font-weight: bold;
    }
    .cont {
      min-width: 400px;
      float: left;
    }
  }
  .applicant {
    
    #applicant { 
      padding-top: 4px; 
    }
    #applicantSelect {
      width: 150px;
      height: 30px;
      overflow: scroll;
      padding: 3px 0 0 8px;
      border: 1px solid $m_gray;
      border-radius: 4px;
      background: white url(../assets/img/arrow_down_gray.svg) no-repeat right 8px center;
      background-size: 8px auto;
    }
  }
  // 공통 체크박스, 라디오
  .type {

    .cont { 
      width: 330px;
    }

    .v-input__slot {
      margin-bottom: 0 !important;
    }

    .cm_check_item {
      margin-bottom: 0 !important;

      &:nth-child(n+4) {
        margin-top: 8px !important;
      }
    }

    ::v-deep .v-input--radio-group__input {
      @extend .flex;

      flex-flow: row wrap;
      justify-content: flex-start;

      i {

        &::after,
        &::before {
          display: none;
        }
      }
    }
  }

  .type_detail {

    .startPeriod,
    .endPeriod {
      width: 140px;
      position: relative;
    }
    .gap {
      margin: 0 8px;
    }

    .period {
      
      input[type="date"] {
        min-width: 160px;
        
        &::-webkit-datetime-edit {
          position: relative; 
        }
        &::-webkit-datetime-edit-fields-wrapper {
          padding: 5px 8px 0;
          position: relative;
          left: 32px;
        }
        &::-webkit-calendar-picker-indicator {
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translate(-100%, -50%);
          background-size: auto 16px !important;
          background-position: center center !important;
        }

        &.startPeriod {
          min-width: 154px;

          &::-webkit-datetime-edit-fields-wrapper {
            left: 26px;
          }
          &::-webkit-calendar-picker-indicator {
            left: 0;
          }
        }

      }

    }
    .time {
      margin-top: 12px;

      ::v-deep .v-input--radio-group__input { 
        @extend .flex;

        justify-content: flex-start;

        .v-radio {
          width: 90px;
          margin-bottom: 0;

          &:last-child { width: 100px; }
        }
      }

      ::v-deep .v-input__control {

        .v-input__slot {
          margin-bottom: 0 !important;
        }
        .v-messages { display: none !important; }
      }

      ::v-deep .v-input__control {

        .v-input__slot {
          margin-bottom: 0 !important;
        }
        .v-messages { display: none !important; }
      }

    }
    .hour {
      margin-top: 12px;
      position: relative;

      input[type="time"] {
        @include date_front_icon;

      &.startHour {
        min-width: 124px;
        
        &::-webkit-datetime-edit-fields-wrapper {
          left: 22px;
        }
        &::-webkit-calendar-picker-indicator {
          left: -12px;
        }
      }

      .hour {
        margin-top: 12px;
        position: relative;

        // input[type="time"] {}
        }
      }
    }
  }
  .reason {
    .reason_text {
      display: block;
      width: 230px;
      height: 24px;
      border-bottom: 1px solid $pale_text;
    }
  }
  .left_dayoff_info {
    margin-bottom: 40px;
    .small_tag {
      @extend .cf;
    }
    .cm_pale_tag {
      float: left;
      margin: 0 16px 16px 0;
      font-family: $spoqa;
    }
    .info {
      float: left;
      font-family: $spoqa;
    }
  }
  .submit {
    .submit_date {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    .dayoff_form_submit {
      width: 100%;
      height: 50px;
      font-size: 24px;
      font-weight: bold;
      color: white;
      border-radius: 30px;
      margin-top: 8px;
      background: $m_blue;
    }
  }
  // 확인 팝업
  .popup_check {
    @extend .flex_col;
    width: 400px;
    .content {
      @extend .flex;
      width: 100%;
      flex: 1 1  auto;
      font-size: 18px;
    }
    .bold {
      font-weight: bold;
    }
  }
  .popup_btn {
    display: block;
    width: 100%;
    height: 50px;
    border-radius: 30px; 
    color: white;
    font-size: 18px;
    font-weight: bold;
    padding-top: 2px;
    background: $apple_green;
    &.blue {
      background-color: $m_blue;
    }
    &.red {
      background-color: $m_red;
    }
    &.yellow {
      background-color: $m_yellow !important;
      color: black;
    }
  }
  // #check_submit_dayoff {}
  // #check_delete_dayoff {}

  #modify_dayoff {
    display: block !important;
    padding-top: 60px !important;

    // .content {}
    .popup_block {

      .cont {
        @extend .flex;

        justify-content: flex-start;
        width: 300px;
      }
    }
    #soldier {
      margin-right: 8px;
    }
    .armyEndDate {
      @include date_front_icon;

      &::-webkit-calendar-picker-indicator {
        left: -24px;
      }

      &:disabled {
        opacity: 0.5;
      }
    }
    .remark {
      margin: 24px 0 40px;

      .remark_text {
        width: 100%;
        height: 80px;
        border: 1px solid $pale_text;
        border-radius: 8px;
      }
    }
  }
</style>