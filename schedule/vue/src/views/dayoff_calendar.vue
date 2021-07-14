<template>
  <div id="dayoff">

    <!-- 달력 -->
    <div class="calendar" @click="closeSidebar">
      <div class="inner" >

        <div class="header">

          <div class="left">
            <h2 class="month_title">{{ trimCalendarMonth }}</h2>
          </div>

          <div class="right">
          
            <input type="button" class="submit_dayoff_btn" value="휴가 신청" @click.stop="dialog = true">
         
            <label class="cm_pale_filter">
              <span class="filter_title">기간 선택</span>
              <input id="calendarMonth" type="month" :value="calendarMonth" @change="calendarMonthPick" >
            </label>
          </div>

        </div>

        <div class="pa-5 calendar_body">
          <v-row>
            <v-col class="body">
              <v-sheet height="auto">
                <v-calendar ref="calendar" :value="calendarDate" :events="events" @click:date="pickDate">

                </v-calendar>
              </v-sheet>
            </v-col>
          </v-row>
          <div class="active_date"></div>
        </div>

      </div>
    </div>

    <!-- 연차 신청 팝업 -->
    <v-dialog v-model="dialog" >
      <!-- :show는 popup 컴포넌트 내에 id 값과 동일함 -->
      <popup :show="'submit_dayoff'" :email="email" @calendar="calendar"  @close="dialog=false"></popup>
    </v-dialog>
    <!-- 사이드바 -->
    <sidebar :todayDate="calendarDate" :email="email" :side="side" @calendar="calendar" @activePopup="activeSidebar" :events="events"></sidebar>

  </div>

</template>

<script>
import sidebar from '../components/sidebar.vue';
import popup from '../components/popup.vue';
import moment from 'moment';

export default {
  name: 'dayoff',
  data() {
    return {
      calendarMonth: String,
      calendarDate: String,
      trimCalendarMonth: String,
      events:[],
      data:[],
      form:{},
      side:[],
      email:String,
      activeSidebar: true,
      dialog: false,
      infoPickDate: {},
      saveStartDate: Number,
      date1:String,
      date:String,
    };
  },
    components: {
        sidebar,
        popup,
    },
  methods: {
      closeSidebar(event) {
          let cal = document.querySelector('.calendar');
          let sidebar = document.getElementById('sidebar');
          let isCal = (event.target == cal);
          if( isCal ) { sidebar.classList.add('inactive'); }
      },
      calendarMonthPick: function(event) {
          this.calendarMonth = event.target.value;
          this.calendarDate = event.target.value + '-01';
          this.trimCalendarMonth = this.calendarMonth.replace('-', '.');
          this.date=this.calendarMonth.replace('-','');
          this.date1=this.calendarMonth;
          console.log(this.date);
          console.log(this.date1);
          this.calendar();
          let box = document.querySelector('.active_date');
          box.classList.add('inactive');
      }, 
      calendar(){
          this.events=[];
          this.axios.get('http://192.168.0.154:3001/yhs/vac/'+this.date+'/'+this.date1).then(r=>{
              for(let i=0;i<r.data.length;i++){
                  if(r.data[i].comment.indexOf('#')!=-1){
                  r.data[i].date= r.data[i].comment.substr(1,10);
                  console.log(r.data[i].date);
                  }    
                r.data[i].date=moment(r.data[i].date).format('YYYY-MM-DD');
                this.data[i]=({name:r.data[i].name+" "+r.data[i].cname,start:r.data[i].date,end:r.data[i].date,color:r.data[i].color});
                this.events.push(this.data[i]);
              } 
          }); 
      },
      pickDate(date){
          let pickDate = event.target.closest('.v-calendar-weekly__day');
          let box = document.querySelector('.active_date');
          if( pickDate.classList.contains('v-outside') ) { return false; }
          box.classList.remove('inactive');
          box.style.top = pickDate.offsetTop + 'px';
          box.style.left = pickDate.offsetLeft + 'px';
          box.style.width = getComputedStyle(pickDate).width;
          box.style.height = getComputedStyle(pickDate).height;
          this.calendarDate=date.date;
          let selectDate=moment(this.calendarDate).format('YYYYMMDD');
          this.date=selectDate;
          let selectDate1=moment(selectDate).format('YYYY-MM-DD');
          this.side=[];
          this.axios.get('http://192.168.0.154:3001/yhs/vac/'+selectDate+'/'+selectDate1).then(r=>{
              for(let i=0;i<r.data.length;i++){
                  r.data[i].date=moment(r.data[i].date).format('YYYY-MM-DD');
                  if(r.data[i].comment.indexOf('#')!=-1){
                      r.data[i].date= r.data[i].comment.substr(1,10);
                      console.log(r.data[i].date);
                  }
                  console.log(r.data);
                  this.side.push({name:r.data[i].name,cname:r.data[i].cname,date:r.data[i].date,stime:r.data[i].stime,etime:r.data[i].etime,color:r.data[i].color});
              }
          }); 
          document.getElementById('today_dayoff').querySelector('.page_label').click();
      },
      activePopup() {
          this.displayPopup = !this.displayPopup;
      },
      changeIsSoldier: function(event) {
          this.isSoldier = !event.target.checked;
      },
  },
  created(){
      const moment = require('moment');
      const today = moment();
      let todayMonth = today.format('YYYY-MM');
      let todayDate = today.format('YYYY-MM-DD');
      this.calendarMonth = todayMonth;
      this.calendarDate = todayDate;
  },
  mounted:function() {
      this.trimCalendarMonth = this.calendarMonth.replace('-', '.');
      this.date=this.calendarMonth.replace('-','');
      this.date1=moment(this.date).format('YYYY-MM')
      console.log(this.date);
      this.axios.get('http://192.168.0.154:3001/yhs/vac/'+this.date+'/'+this.date1).then(r=>{
           console.log(r.data);
          for(let i=0;i<r.data.length;i++){
              if(r.data[i].comment.indexOf('#')!=-1){
                r.data[i].date= r.data[i].comment.substr(1,10);
              }
              r.data[i].date=moment(r.data[i].date).format('YYYY-MM-DD');
              this.data[i]=({name:r.data[i].name+" "+r.data[i].cname,start:r.data[i].date,
              end:r.data[i].date,color:r.data[i].color});
          }
      this.email=this.$store.state.user.email;
      this.events=this.data;  
      }); 
  },
  watch:{ 
      date: function(val){
        console.log(val);
        if(val.length> 6){
          this.date1=moment(this.date).format('YYYY-MM-DD');
          console.log(this.date1);
        }else {
          this.date1=moment(this.date).format('YYYY-MM');
          console.log(this.date1);
        }      
      }
      
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";

  #dayoff {
    @extend .flex;

    justify-content: stretch;
    width: 100%;
    height: 100%;
    background: $m_pale;

    > div {
      height: 100%;
    }


    @include relative-web {
      display: block;
    }
  }

  .calendar {
    @extend .flex;

    flex: 1 1 1200px;

    .inner {
      width: 1100px;
    }
    .header {
      @extend .flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 16px;

      .right {
        @extend .cf;
      }

      .month_title {
        font-size: 54px;
        font-weight: bold;
        letter-spacing: -1px;
        position: relative;
        bottom: -8px;
        color: $m_black;
      }
      .submit_dayoff_btn {
        float: left;
        height: 30px;
        width: 150px;
        text-align: center;
        color: white;
        font-size: 16px;
        line-height: 33px;
        margin-right: 16px;
        // padding-top: 3px;
        border-radius: 8px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
        background: $m_blue;
      }
    }

    @include relative-web {
      flex: unset;
    }
  }
  // vuetify calendar
  .v-application .pa-5 {
    padding: 0 !important;
  }

  .body {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0px 16px rgba(0, 0, 0, 0.15);
  }
  ::v-deep .v-calendar-weekly {
    border: 0 !important;
  }
  ::v-deep .v-calendar-weekly__head { 

    > div {
      height: 30px;
      line-height: 30px;
      padding-top: 2px;
      color: white !important;
      font-size: 16px;
      font-weight: bold;
      border: 0 !important;
      background: $m_blue !important;
    }
  }
  ::v-deep .v-calendar-weekly__day {
    display: flex;
    height: 110px;
    flex-flow: wrap row;
    align-content: flex-start;
    border-right-color: #efefef !important;
    border-bottom-color: #efefef !important;
    margin-right: 0 !important;
    position: relative;

    .v-calendar-weekly__day-label {
      display: inline-block;
      width: 100%;
      height: 30px;
      text-align: left !important;
      font-weight: bold;
      margin-top: 0;

      .v-btn {
        width: auto !important;
        min-width: 30px;
        height: 30px;
        background: unset !important;
        font-size: 12px; 

        &::before {
          // display: none;
        }
      }
    }

    &:nth-child(7n) {
      border-right-color: transparent !important;
      background: $pale_blue;

      .v-btn {
        color: $m_blue;
      }
    }
    &:nth-child( 7n + 1 ) {
      background: $pale_red;

      .v-btn {
        color: #E46262;
      }
    }

    &.v-outside {
      background-color: #fbfbfb !important;
    }
  }

  // 달력 선택시 테두리
  .calendar_body {
    position: relative;
    
    .active_date {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      top: 10px;
      left: 10px;
      outline: 4px solid $m_blue;
      transition: all 0.2s;

      &.inactive {
        width: 0 !important;
        height: 0 !important;
        left: 5px !important;
        top: 15px !important;
      }
    }
  }
</style>
