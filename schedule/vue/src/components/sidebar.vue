<template>
  <div id="sidebar" class="inactive">
    <!-- 탭 | 당일 연차 -->
    <div id="today_dayoff" class="page active">
      <p class="page_label" @click="activeSidebar"><span>당일 연차 사용 현황</span></p>
      <div class="content">
        <h3 class="title">{{ todayDate.replace(/-/gi, '.') }} 연차 현황</h3>
        <div class="today_dayoff_wrap">
          <ul class="today_dayoff">
            <!-- 휴가 사용 목록 하나 시작 -->
            <li 
              class="dayoff" 
              v-for="item in side" :key="item.no" 
              :style="'border-color: ' + item.color + '!important'"
            > 
              <p class="info"> 
                <span class="name">{{item.name}}</span>
                <span class="type">{{cname(item.cname,item.stime)}}</span>
              </p>
              <p class="day">
                <span class="time">{{item.stime}} ~ {{item.etime}} </span>
              </p>
            </li>
            <!-- 휴가 사용 목록 하나 끝 -->
          </ul>
        </div>
      </div>
    </div>

    <!-- 탭 | 내 연차 현황 -->
    <div id="my_dayoff_status" class="page">
      <p class="page_label" @click="activeSidebar"><span>개인 연차 현황</span></p>
      <div class="content">
        <h3 class="title">{{name}} 연차 현황</h3>

        <ul class="my_dayoff">
          <!-- 내 연차 현황 정보 하나 시작 -->
            <!-- 연차 소진일 1달 이내로 남았을 시, .red 추가  -->
          <li 
              class="status_info" 
              v-for="(value, name) in myDayoffStatus" :key="'my_dayoff' + name"
              :class="name == 'dayoffPercent'  ? statusDayoffPer : ''"
          >
            <p class="title">{{ value.name }}</p>
            <p class="value">{{ value.value }}</p>
          </li>
          <!-- 내 연차 현황 정보 하나 시작 -->
        </ul>

        <p class="info">
          <span class="title">* 연차 계산 법</span><br>
          1년 미만의 경우 1개월 개근시 1일, 총 11일 발생<br>
          <br>
          1년 이상인 경우 80% 미만 출근 시 1개월 개근시 1일<br>
          80% 이상 출근시 15일 발생<br>
          <br>
          추후 2년 추가 근무시 1일 가산<br>
          총 25일 한도<br>
        </p>
      </div>
    </div>

    <!-- 탭 | 연차 사용 목록 -->
    <div id="my_dayoff_list" class="page" >
      <p class="page_label" @click="activeSidebar"><span>내 연차 사용 목록</span></p>
      <div class="content">
        <h3 class="title">내 연차 사용 목록</h3>
        <!-- <div class="filter_box">
          <label class="cm_pale_filter">
            <span class="filter_title">기간 선택</span>
            <input type="date" v-model=form1.date>
          </label>
        </div> -->
        <div class="filter">
          <div class="cm_page_date">
            <input type="button" value="prev" class="control prev_date" @click="changePrevYear">
            <input type="text" class="date start_date" :value="this.date.sdate" readonly>
            <span class="gap">~</span>
            <input type="text" class="date end_date" :value="this.date.edate" readonly>
            <input type="button" value="next" class="control next_date" @click="changeNextYear" disabled="true">
          </div>
        </div>

        <div class="my_dayoff_wrap" >
          <ul class="my_dayoff">
            <!-- 휴가 사용 목록 하나 시작 -->
            <!-- 날짜가 지난 데이터는 .expired 추가 -->
            <li class="dayoff" v-for="item in data2" :key="item.no">
              <p class="info">
                <span class="name">{{name}}</span>
                <span class="type">{{cname(item.name,item.stime)}}</span>
              </p>
              <div class="day">
                <p class="date">{{format(item.date)}}</p>
                <p class="time">{{item.stime}} ~ {{item.etime}}</p>
              </div>
              <div class="manage">
                <input type="button" value="수정" :class="active_modify(item.date,item.stime)" @click.stop="test1(item.no)">
                <input type="button" value="삭제" :class="active_delete(item.date,item.stime)" @click.stop="test(item.no)">
              </div>
            </li>
            <!-- 휴가 사용 목록 하나 끝 -->
          </ul>
        </div>
      </div>
    </div>

    <!-- 수정 팝업 -->
    <v-dialog v-model="dialogModify" >
      <popup :show="'submit_dayoff'" :no="no" :data3="data3" @calendar="calendar" @vacStatus="vacStatus" @uservac="uservac"  @close="dialogModify = false "></popup>
    </v-dialog>
    <!-- 삭제 확인 팝업 -->
    <v-dialog v-model="dialogDelete" >
      <popup   :no="no" :data3="data3" @vacStatus="vacStatus" @calendar="calendar" @uservac="uservac" @close="dialogDelete = false" :show="'check_delete_dayoff'" ></popup>
    </v-dialog>
    
     
  </div>
</template>

<script>
import moment from 'moment'
import popup from './popup.vue'
export default {
  name: 'sidebar',
  components: {
    popup,
  },
  data() {
      return {
          myDayoffStatus: {
              remainDayoff: { name: '남은 연차', value: 10},
              quantityDayoff: { name: '발생 연차', value: 15},
              deadlineDayoff: { name: '연차 소진일', value: '11/5'},
              dayoffPercent: { name: '남은 일 수 대비 남은 연차', value: '120%'},
              useDayoff: { name: '사용 연차', value: 3.5},
          },
          statusDayoffPer: '',
          form:{},
          form1:{},
          id:[],
          data1:[],
          date:{},
          data2:[],
          data3:[],
          sdate:String,
          edate:String,
          name:String,
          no:String,
          dialogModify: false,
          dialogDelete: false,
      };
  },
  methods: {
      activeSidebar: function(event) {
          let indexs = document.querySelectorAll('.page');
          let sidebar = document.getElementById('sidebar');
          sidebar.classList.remove('inactive');
          indexs.forEach(function(value) {
              value.classList.remove('active');
          })
          event.target.parentNode.classList.add('active');
      },
      changePrevYear() {
          this.date.sdate=moment(this.date.sdate).add("-1","y").format('YYYY-MM-DD');
          this.date.edate=moment(this.date.edate).add("-1","y").format('YYYY-MM-DD');
          this.sdate=this.date.sdate.replace(/-/gi, "");
          this.edate=this.date.edate.replace(/-/gi, "");
          if(this.edate<moment().format('YYYYMMDD')){
              document.querySelector('.next_date').disabled = false;
              }else{
              document.querySelector('.next_date').disabled = true;
          }
      },
      changeNextYear() {
          this.date.sdate=moment(this.date.sdate).add("1","y").format('YYYY-MM-DD');
          this.date.edate=moment(this.date.edate).add("1","y").format('YYYY-MM-DD');
          this.sdate=this.date.sdate.replace(/-/gi, "");
          this.edate=this.date.edate.replace(/-/gi, "");
          if(this.edate<moment().format('YYYYMMDD')){
              document.querySelector('.next_date').disabled = false;
          }else{
              document.querySelector('.next_date').disabled = true;
          }
      },
      mod(no){
          this.axios('http://192.168.0.154:3001/yhs/user/read/'+no).then(r=>{
              this.data3=r.data;
          })
      },
      test(no){
          this.no= no;
          this.mod(no);
          this.dialogDelete = true;
      },
      test1(no){
          this.no=no;
          this.mod(no);
          this.dialogModify = true;
      },
      format(value){
          value=moment(value).format('YYYY-MM-DD');
          return value;
      },
      vacStatus(){
          this.axios.get('http://192.168.0.154:3001/yhs/user/'+this.nid[0].id).then(r=>{
              this.data1=r.data;
              this.myDayoffStatus.remainDayoff.value=r.data.bal;
              this.myDayoffStatus.quantityDayoff.value=r.data.num;
              this.myDayoffStatus.deadlineDayoff.value=moment(r.data.edate).format('YYYY.MM.DD');
              this.myDayoffStatus.dayoffPercent.value=r.data.per;
              if( parseInt(r.data.per) < 50 ) { this.statusDayoffPer = 'red' } 
              else if( parseInt(r.data.per) >= 150 ) { this.statusDayoffPer = 'blue';}
              this.myDayoffStatus.useDayoff.value=r.data.count;
          })   
      },
      uservac(){
          this.axios.get('http://192.168.0.154:3001/yhs/user/'+this.nid[0].id+"/"+this.sdate+"/"+this.edate).then(r=>{
              this.data2=[];
              for(let i=0;i<r.data.length;i++){
                  if(r.data[i].comment.indexOf('#')!=-1){
                      let t=moment(r.data[i].comment.substr(1,10)).format('YYYYMMDD');
                      // console.log(t);
                      if(this.sdate<t && t<this.edate){
                          r.data[i].date=t;
                          this.data2.push(r.data[i]);
                      } 
                  }else{
                      this.data2.push(r.data[i]);
                  } 
              }
              console.log(this.data2);
          })
      },
      async calendar(){
          await this.$emit('calendar'); 
      },
      cname(name,stime){
          if(name=='반차'&&stime=='08:30'){
              name='오전 반차';
          }else if(name=='반차'&&stime=='13:30'){
              name='오후 반차';
          }
          return name;
      },
      active_modify(val,stime){
          if(val+stime.replace(':','')<=moment().format('YYYYMMDDHHmm')){
              val="hidden"
          }else{
              val="modify"
          }
          return val;
      },
      active_delete(val,stime){
          if(val+stime.replace(':','')<=moment().format('YYYYMMDDHHmm')){
              val="hidden"
          }else{
              val="delete"
          }
          return val;
      }
  },
  watch:{
      email: async function(val){
          this.email=val;
          await this.axios.get('http://192.168.0.154:3001/yhs/user/name/'+this.email).then(r=>{
              this.nid=r.data;
              this.name=r.data[0].name;
          })
          await this.axios.get('http://192.168.0.154:3001/yhs/user/date/'+this.nid[0].id).then(r=>{
              r.data.sdate=moment(r.data.sdate).format('YYYY-MM-DD');
              r.data.edate=moment(r.data.edate).format('YYYY-MM-DD');
              this.date=r.data;
              this.sdate=r.data.sdate.replace(/-/gi, "");
              this.edate=r.data.edate.replace(/-/gi, "");
          }); 
          await this.vacStatus();
      },
      sdate: function(val){
          this.uservac();
      },
      events: function(val){
          if(this.nid!=undefined){
              this.uservac();
              this.vacStatus();
          }
      },
  },
  props:[
      'todayDate',
      'side',
      'events',
      'email'
  ],
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";
 
  #sidebar {
    width: 360px;
    height: 100%;
    flex: 0 0 360px;
    border-radius: 0 0 0 16px;
    position: relative;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    transition: transform 0.5s, flex-basis 0.5s;
    transition-delay: 0.5s, 0;
    background: white;

    @include relative-web {
      height: calc(100% - 50px) !important;
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 3;
    }

    &.inactive {
      transform: translateX(100%);
      flex-basis: 0;
      transition: transform 0.5s, flex-basis 0.5s;
    }
    
    .page {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;

      &.active {
        z-index: 4;

        .page_label {
          opacity: 1;
        }
      }
    }
    .page_label {
      width: 50px;
      height: 80px;
      transform: translateX(-100%);
      border-radius: 8px 0 0 8px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      opacity: 0.5;
      cursor: pointer;
      background: white no-repeat center;
      background-size: 24px auto;

      span {
        @extend .text_hidden;

        display: block;;
      }
      
      &::after {
        content: "";
        width: 0;
        height: 0;
        display: block;
        border: 25px solid white;
        border-bottom-color: transparent;
        border-left-color: transparent;
        position: absolute;
        bottom: 0;
        right: -17px;
        margin-bottom: -33px;
        transform: rotate(-32deg);
      }

      &:hover {
       opacity: 1;
      }
    }
    .content {
      width: 100%;
      height: 100%;
      // padding: 32px 24px;
      position: relative;
      z-index: 3;
      border-radius: 0 0 0 16px;
      overflow: hidden;
      background: white;

      .title {
        width: 100%;
        font-size: 24px !important;
        font-weight: bold;
        color: $m_blue;
        margin-bottom: 32px;
        padding: 32px 24px 0;
      }
    }
  }
  // 당일 연차 사용 목록
  #today_dayoff {
    // display: none;
    z-index: 3;

    .page_label {
      background-color: $m_blue;
      background-image: url(../assets/img/today_icon.svg);

      &::after {
        border-top-color: $m_blue;
        border-right-color: $m_blue;
      }
    }
    
    .content {
      @extend .flex_col;

      justify-content: stretch;

      .title { flex: 0 0 auto; }
    }

    .today_dayoff_wrap {
      width: 100%;
      padding: 0 24px 80px;
      flex: 1 1 auto;
      overflow-y: scroll;
      position: relative;
    }
    .today_dayoff {
      width: 100%;
      flex: 1 1 auto;

      .dayoff {
        @extend .flex_col; 

        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 50px;
        border-left: solid 8px $m_blue ;
        padding: 10px 8px 6px;
        margin-bottom: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        
        .info {
          line-height: 1;

          span {
            font-size: 16px;
            font-family: $spoqa;
            margin-right: 5px;
          }
        }

        .day {
          line-height: 1;
          
          span {
            font-size: 14px;
            color: $pale_text;
          }
        }
      }
    }

    .submit_dayoff_wrap {
      width: 100%;
      padding: 24px;
      flex: 0 0 auto;
      position: relative;

      &::before {
        content: "";
        display: block;
        width: 100%;
        height: 80px;
        position: absolute;
        left: 0;
        top: 0;
        transform: translateY(-100%);
        background: linear-gradient(to bottom, transparent 20%, white 80%);
      }

      .submit_dayoff {
        display: block;
        width: 100%;
        height: 42px;
        border-radius: 8px;
        text-align: center;
        font-size: 20px;
        color: white;
        cursor: pointer;
        background: $m_blue;
      }
    }
  }
  
  // 내 연차 현황
  #my_dayoff_status {
    // display: none;
    z-index: 2;

    .page_label {
      margin-top: 80px;
      background-color: $apple_green;
      background-image: url(../assets/img/profile_icon.svg);

      &::after{
        border-top-color: $apple_green;
        border-right-color: $apple_green;
      }
    }

    .content {
      @extend .flex_col;

      justify-content: stretch;

      .title {
        color: $apple_green;
        text-align: center;
      }
      > .title {
        flex: 0 0 auto;
      }
    }
    .my_dayoff {
      width: 100%;
      flex: 1 1 auto;
      padding: 0 32px;

      .status_info {
        width: 100%;
        padding: 3px;
        border-radius: 8px;
        margin-bottom: 16px;
        background: $apple_green;

        .title {
          padding: 8px 0;
          color: white !important;
          font-size: 16px !important;
          font-weight: bold;
          margin-bottom: 0;
        }
        .value {
          color: $apple_green;
          border-radius: 6px;
          text-align: center;
          padding: 12px 0;
          font-size: 28px;
          font-weight: bold;
          background: white;
        }

        &.red {
          background: $m_red;

          .value { color: $m_red; }
        }

        &.blue {
          background: $m_blue;

          .value { color: $m_blue; }
        }
      }

    }

    .info {
      flex: 0 0 auto;
      width: 100%;
      padding: 0 24px 24px;

      .title {
        display: inline-block;
        text-align: left;
        color: $pale_text;
        font-size: 14px !important;
        margin-bottom: 8px;
        padding: 0;
      }

      color: $pale_text;
      font-size: 12px;
    }
  }

  // 내 연차 사용 목록
  #my_dayoff_list {
    // display: none;
    z-index: 1;

    .page_label {
      margin-top: 160px;
      background-color: $sky_blue;
      background-image: url(../assets/img/info_icon.svg);

      &::after{
        border-top-color: $sky_blue;
        border-right-color: $sky_blue;
      }
    }

    .content {
      @extend .flex_col;

      justify-content: stretch;
      position: relative;

      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 80px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(to bottom, transparent 20%, white 80%);
      }
      .title {
        text-align: center;
        flex: 0 0 auto;
        color: $sky_blue;
      }
    }

    .filter {
      width: 100%;
      padding: 0 24px;
    }

    .my_dayoff_wrap {
      width: 100%;
      flex: 1 1 auto;
      overflow-y: scroll;
    }
    .my_dayoff {
      
      width: 100%;
      padding: 0 24px 80px;

      .dayoff {
        @extend .flex_col;

        width: 100%;
        height: 64px;
        justify-content: center;
        align-items: flex-start;
        border-radius: 8px;
        padding: 10px 12px 6px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) ;
        position: relative;
        overflow: hidden;
        background: white;

        .info {
          line-height: 1;

          span {
            font-weight: bold;
            margin-right: 4px;
          }
        }
        .day {
          margin-top: 4px;
          p {
            font-size: 14px;
            margin-right: 4px;
            line-height: 14px;
            color: $pale_text;
          }
        }
        .manage {
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;

          input {
            width: 45px;
            height: 100%;
            color: white;
            line-height: 90px;
            font-size: 14px;
            text-align: center;
            background: no-repeat center 35%;
            background-size: auto 16px;
          }
          .modify {
            border-radius: 0 0 0 8px;
            background-color: $m_yellow !important;
            background-image: url(../assets/img/modify_icon.svg);
          }
          .hidden{
            display:none;
          }
          .delete {
            background-color: $m_red;
            background-image: url(../assets/img/delete_icon.svg);
          }
        }

        &.expired {

          .delete { display: none; }
        }
      }
    }
  }
</style>