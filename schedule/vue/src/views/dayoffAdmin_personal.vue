<template>
  <div id="dayoffAdmin_personal">
    <div class="inner">

      <div class="filter">

        <label 
          for="childcare" 
          class="cm_pale_filter is_childcare"
          
        >
          <input 
            id="childcare" 
            type="checkbox" value="육아기 단축 근로" 
            :checked="createChildcare"
            @change="toggleCreateChildcare"
            class="white"
          >
          <span class="filter_title">육아기 단축 근로</span>

          <div class="value" v-if="createChildcare">
            <input type="text" v-model="bnum" class="childcareTotal" readonly>
            <input type="button" 
              value="육아기 단축 근로 생성하기" class="createChildcare"
              @click="createChildcareFn"
            >
            <input type="button" value="reset" @click="removebnum" class="reset">
          </div>

        </label>
        
        <div class="filter1">
          <div class="cm_page_date select_period">
            <input type="button" value="prev" class="control prev_date" @click="changePrevYear">
            <input type="text" class="date start_date" :value="this.sdate" readonly>
            <span class="gap">~</span>
            <input type="text" class="date end_date" :value="this.edate" readonly>
            <input type="button" value="next" class="control next_date" @click="changeNextYear" disabled="true">
          </div>
        </div>
        

      </div>

      <div class="list_wrap">
        <div class="list_inner">
          <ul class="personal_dayoff_list">

            <li class="list_item header">
              <p class="column header_item" v-for="header in headerData" :key="'header_' + header.class">
                <span class="text">{{ header.name }}</span>
              </p>
            </li>

            <!-- 하나 반복 시작 -->
            <li 
              class="list_item personal_dayoff_item" 
              v-for="(item, index) in listData" 
              :key="index"
            >
              <p class="column name">
                <span class="text">{{ item.name }}</span>
              </p>
              <p class="column type">
                <span class="text">{{ item.cname  }}</span>
              </p>
              <p class="column period">
                <span class="text">{{ format(item.date) }}</span>
              </p>
              <p class="column time">
                <span class="text">{{ item.stime}}~{{item.etime}}</span>
              </p>
              <p class="column submited_date">
                <span class="text">{{ item.comment }}</span>
              </p>

              <p class="column management">
                <input type="button"  class="personal_modify" value="연차 수정하기" @click="modify(item.no)">
                <input type="button"  class="personal_delete" value="연차 삭제하기" @click="del(item.no)">
              </p>

            </li>
            <!-- 하나 반복 끝 -->

          </ul>
        </div>
      </div>

    </div>

    <!-- 군복무 팝업 -->
    <v-dialog v-model="popup_modify">
      <popup :show="'submit_dayoff'" @reset="reset" :no="no" :data3="data3" @close="popup_modify = false"></popup>
    </v-dialog>
    <!-- 삭제 팝업 -->
    <v-dialog v-model="popup_delete">
      <popup :show="'check_delete_dayoff'" @reset="reset" :no="no" :data3="data3" @close="popup_delete = false"></popup>
    </v-dialog>


  </div>
</template>

<script>
import popup from '../components/popup.vue';
import moment from 'moment';
export default {
  name: 'dayoffAdmin_personal',
  data() {
    return {
      headerData: [
        {name: '사용자', class: 'name' },
        {name: '구분', class: 'type' },
        {name: '사용 날짜', class: 'period' },
        {name: '사용 시간', class: 'time' },
        {name: '사유', class: 'submited_date' },
        {name: '관리', class: 'management' },
      ],
      listData : [
        { name:'윤태현',
          type: '연차',
          period: '2021.02.13',
          stime: '08:30',
          submited_date: '2021.02.12',
        },
      ],
      createChildcare: false,
      popup_modify: false,
      popup_delete: false,
      form:{},
      data3:[],
      bnum:String,
      no:String,
      name:String,
      calendarMonth:String,
      id:String,
      sdate:String,
      edate:String,
    };
  },
  methods: { 
      calendarMonthPick: function(event) {
          this.calendarMonth = event.target.value;
          this.form.date=this.calendarMonth;
          this.reset();
      },
      toggleCreateChildcare: function(event) {
          this.createChildcare = event.target.checked;
      },
      createChildcareFn() {
          let value = prompt('추가하고자 하는 육아기 단축 근로 시간을 입력해주세요');
          if( value == '' ) {
              alert('값을 입력해주세요');
              return 0;
          } 
          if( value !== null && isNaN(parseInt(value)) ) {
              alert('숫자를 입력해주세요');
              return 0;
          } 
          if( typeof Number(value) == 'number' ) {
              this.form.bnum=value;
              this.axios.patch('http://192.168.0.154:3001/yhs/user/',this.form).then(r=>{
                  this.resetb(); 
              })
          }
      },
      format(val){
          val=moment(val).format('YYYY-MM-DD');
          return val;
      },
      mod(no){
          this.axios.get('http://192.168.0.154:3001/yhs/user/read/'+no).then(r=>{
              this.data3=r.data;
          })
      },
      modify(no){
          this.popup_modify = true;
          this.no=no;
          this.mod(no);
      },
      del(no){
          this.popup_delete = true;
          this.no=no;
          this.mod(no);
      },
      reset(){
          let sdate=moment(this.sdate).format('YYYYMMDD');
          let edate=moment(this.edate).format('YYYYMMDD');
          this.axios.get('http://192.168.0.154:3001/yhs/vac/'+sdate+'/'+edate+'/'+this.form.id).then(r=>{
              this.listData=[];
              for(let i=0;i<r.data.length;i++){
                  if(r.data[i].comment.indexOf('#')!=-1){
                      let t=moment(r.data[i].comment.substr(1,10)).format('YYYYMMDD');
                      // console.log(t);
                      if(this.sdate<t && t<this.edate){
                          r.data[i].date=t;
                          this.listData.push(r.data[i]);
                      } 
                  }else{
                      this.listData.push(r.data[i]);
                  } 
              }
              console.log(this.listData);
          })
      },
      resetb(){
          this.axios.get('http://192.168.0.154:3001/yhs/user/bnum/'+this.form.id).then(r=>{
              this.name='';
              this.name=r.data[0].name
              this.bnum=r.data[0].bnum
              if(r.data[0].bnum==null){
                  r.data[0].bnum='0';
              }
              if(this.bnum !='0'){
                  this.createChildcare= true;
              }else{
                  this.createChildcare= false;
              }
          })
      },
      removebnum(){
          this.axios.patch('http://192.168.0.154:3001/yhs/user/'+this.form.id).then(r=>{
              this.resetb();
          })
      },
         changePrevYear() {
          this.sdate=moment(this.sdate).add("-1","y").format('YYYY-MM-DD');
          this.edate=moment(this.edate).add("-1","y").format('YYYY-MM-DD');
          
          let s=this.sdate.replace(/-/gi, "");
          let e=this.edate.replace(/-/gi, "");
          if(e<moment().format('YYYYMMDD')){
              document.querySelector('.next_date').disabled = false;
              }else{
              document.querySelector('.next_date').disabled = true;
          }
      },
      changeNextYear() {
          this.sdate=moment(this.sdate).add("1","y").format('YYYY-MM-DD');
          this.edate=moment(this.edate).add("1","y").format('YYYY-MM-DD');
          let s=this.sdate.replace(/-/gi, "");
          let e=this.edate.replace(/-/gi, "");
          if(e<moment().format('YYYYMMDD')){
              document.querySelector('.next_date').disabled = false;
          }else{
              document.querySelector('.next_date').disabled = true;
          }
      },
      vac(){
        this.axios.get('http://192.168.0.154:3001/yhs/user/date/'+this.form.id).then(r=>{
              r.data.sdate=moment(r.data.sdate).format('YYYY-MM-DD');
              r.data.edate=moment(r.data.edate).format('YYYY-MM-DD');
              this.sdate=r.data.sdate
              this.edate=r.data.edate
          }); 
       
      }
  },
  components: {
      popup,
  },
  mounted:function(){
      this.form.date=moment().format('YYYY-MM');
      this.form.id=this.$route.params.id;
      this.reset();
      this.resetb();
      this.vac();
  },
  watch:{
      sdate:function(val){
        this.reset();
      }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";

  #dayoffAdmin_personal {
    @extend .flex;
    
    width: 100%;
    height: 100%;
    background: $m_pale;

    .inner {
      width: 1080px;
    }
  }
  .filter {
    @extend .flex;

    justify-content: flex-end;
    margin-bottom: 16px; 

    .is_childcare {
      margin-right: 16px;
      padding: 3px 0 3px 12px;
      background: $m_gray !important;

      #childcare {
        display: block;
        float: left;
        margin: 10px 8px 0 0;

      }
      .filter_title {
        width: auto;
        font-size: 16px;
        padding-right: 16px;
        padding-top: 1px;
      }
      .value {
        display: inline-block;
        height: 30px;
        padding-right: 6px;
        border-right: 3px solid $m_gray;
        background: white;

        .childcareTotal {
          display: inline-block;
          width: 60px;
          height: 30px;
          position: relative;
          bottom: -0.5px;
          margin: 0;
          vertical-align: middle;
          padding: 3px 8px 0;
          cursor: default;
          background: white;
        }
        input[type="button"] {
          border-radius: 20px;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
          background: $m_blue no-repeat center;
          background-size: 9px auto;

          &.createChildcare {
            @extend .text_hidden;

            width: 24px;
            height: 24px;
            background-image: url(../assets/img/plus_icon.svg);
          }
          &.reset {
            @extend .text_hidden;

            width: 24px;
            height: 24px;
            margin-left: 8px;
            color: white;
            position: relative;
            bottom: -0.5px;
            background-image: url(../assets/img/refresh.svg);
            background-size: 12px auto;
          }
        }
      }

      &.disabled { opacity: 0.5;}

    }

    .select_period {
      margin-bottom: 0;
    }
  }

  .list_wrap {
    width: 100%;
    height: 600px;
    overflow-y: hidden;
    position: relative;
    padding-top: 50px;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);

    .list_inner {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }

    .personal_dayoff_list {
      width: 100%;
      min-height: 100%;
      background: white;
      
      .list_item {
        display: grid;
        width: 100%;
        grid-template-rows: 50px;
        grid-template-columns: 120px 100px minmax(120px, 1fr) minmax(120px, 1fr) minmax(180px, 1fr) 100px;
        background: white;

        .column {
          @extend .flex;

          .text {
            padding-top: 2px;
          }
        }
      }
    }

    .header {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow-y: scroll;
      background: unset !important;

      &::-webkit-scrollbar { background-color: $m_blue; }

      .header_item {
        height: 100%;
        overflow-y: hidden;
        background: $m_blue;
      }
      .text {
        color: white;
      }
    }

    .personal_dayoff_item {
      border-bottom: 1px solid #eeeeee;
    }

    .management {

      input {
        @extend .text_hidden;

        width: 28px;
        height: 28px;
        border-radius: 15px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        background: no-repeat center center;
        background-color: $m_yellow !important;
        background-size: auto 14px;
      }
      .personal_modify {
        margin-right: 8px;
        background-image: url(../assets/img/modify_black.svg);
      }
      .hidden {
        display:none ;
      }
      .personal_delete {
        background-color: $m_red !important;
        background-image: url(../assets/img/delete_icon_black.svg);
        background-position: center 8.5px;
      }
    }
  }
</style>