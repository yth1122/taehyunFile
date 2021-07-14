<template>
  <div id="attendance_management">
    <div class="content_header">
      <p class="title">출퇴근 기록 조회</p>
      <div class="filters">
        <div class="cm_round_box select_date_box">
          <p class="cm_title select_date">날짜</p>
          <input type="date" v-model="form.sdate"  class="input_date">
        </div>
         <div class="cm_round_box select_date_box">
          <p class="cm_title select_date">날짜</p>
          <input type="date" v-model="form.edate"  class="input_date" >
        </div>
        <div class="cm_round_box entry_type">
          <select name="entry_type" class="entry_type_select" v-model="form.type">
              <option value="%" class="cm_title">전체</option>
            <template  v-for="item in entryType">
              <option  class="entry_option" :value="item.index" :key="'entrytype' + item.index">{{ item.name }}</option>
            </template>
          </select>
        </div>
        <div class="cm_round_box search_bar">
          <p class="cm_title">검색</p>
          <input type="text" v-model="form.name" class="input_text search_input" @keyup.enter="submit">
          <input type="button" value="검색" class="cm_button"  @click="submit">
        </div>
      </div>
    </div>
    <div class="content">
      <div class="attendance_list">
        <ul class="attendance">
          <!-- 리스트 카테고리 -->
          <!-- <li class="attend_category" :style="{ paddingRight: scrollWidth+'px'}"> -->
          <li class="attend_category">
            <p v-for="item in attend_cate" 
              :class="'cate_' + item.class" 
              :key="'cate_' + item.class"
            >
              <span>{{ item.name }}</span>
              <input type="button" v-if="item.filter"  class="filter_align"  value="정렬" @click="filter_align">
            </p>
          </li>
          <!-- 리스트 한 줄 -->
          <li class="attend_i" v-for="item in data" :key="item.no"  >
            <p class="attend_data_name">
              {{ item.name }}
            </p>
            <p class="attend_data_date">
              {{ item.date }}
            </p>
            <p class="attend_data_result">
              {{ item.type }}
            </p>
            <p class="attend_data_empty">
                </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import moment from 'moment'
export default {
  name: 'attendanceManagement',
  data() {
    return {
      attend_cate: [
        { class: 'name', name: '사원명', filter: false},
        { class: 'date', name: '날짜', filter: true},
        { class: 'result', name: '구분', filter: false}
      ],
      data: [],
      form: {},
      entryType: [
        {index: 1, name: '출근'},
        {index: 2, name: '퇴근'},
        {index: 3, name: '외출'},
        {index: 4, name: '복귀'},
        {index: 5, name: '출입'},
      ],
      scrollWidth: Number,
      sort: false
      
    }; 
  },
  mounted:function(){
      let list_wrap = parseInt(window.getComputedStyle(document.querySelector(".attendance_list")).width);
      let list_inner = parseInt(window.getComputedStyle(document.querySelector(".attendance")).width);
      this.scrollWidth = list_wrap - list_inner;
      this.form.sdate = moment().format('YYYY-MM-DD');    
      this.form.type = '%'
      this.axios.post('http://192.168.0.154:3001/yhs/user/',this.form).then(r =>{ 
          this.data = r.data;
          for(let i = 0; i < r.data.length; i++ ){
              let str=r.data[i].date;
              str= str.substr(0,8)+"T"+str.substr(8,14);
              r.data[i].date= moment(str).format('YYYY-MM-DD HH:mm:ss');
              if(r.data[i].type==1){
                  r.data[i].type='출근';
              }
              if(r.data[i].type==2){
                  r.data[i].type='퇴근';
              }
              if(r.data[i].type==3){
                  r.data[i].type='외출';
              }
              if(r.data[i].type==4){
                  r.data[i].type='복귀';
              }
              if(r.data[i].type==5){
                  r.data[i].type='출입';
              } 
              if(r.data[i].type==7){
                  r.data[i].type='세트';
              } 
              if(r.data[i].type==9){
                  r.data[i].type='해제';
              } 
          }
      });
  },
 
  methods:{
    submit(){
        this.axios.post('http://192.168.0.154:3001/yhs/user/',this.form).then(r =>{
            this.data=r.data;
            for(let i = 0; i < r.data.length; i++ ){
                let str=r.data[i].date;
                str= str.substr(0,8)+"T"+str.substr(8,14);
                r.data[i].date= moment(str).format('YYYY-MM-DD HH:mm:ss');
                if(r.data[i].type==1){
                    r.data[i].type='출근';
                }
                if(r.data[i].type==2){
                    r.data[i].type='퇴근';
                }
                if(r.data[i].type==3){
                    r.data[i].type='외출';
                }
                if(r.data[i].type==4){
                    r.data[i].type='복귀';
                }
                if(r.data[i].type==5){
                    r.data[i].type='출입';
                }  
                if(r.data[i].type==7){
                    r.data[i].type='세트';
                } 
                if(r.data[i].type==9){
                    r.data[i].type='해제';
                } 
            }
        })
    },
    filter_align(event) {
        event.target.classList.toggle('filter_align-active');
        if(this.sort){//desc
            this.data.sort(function(a,b){
                if(a.date < b.date){
                    return 1
                }else if(b.date < a.date){
                    return -1
                }
            })
        }else{//asc
            this.data.sort(function(a,b){
                if(a.date < b.date){
                    return -1
                }else if(b.date < a.date){
                    return 1
                }
            })
        }
          this.sort = !this.sort
    }
  }
}

</script>

<style lang="scss" scoped>
@import '../assets/css/global.scss';

  #attendance_management {
    @extend .flex_col;
    
    width: 100%;
    height: 100%;
    padding: 24px;
    background: $m_pale;
  }
  .content_header {
    @extend .flex;

    width: 100%;
    flex: 0 0 auto;
    justify-content: space-between;
    margin: 8px 0 32px;
    
    .title {
      font-size: 24px !important;
      font-weight: bold;
      color: $m_blue;
    }
    .filters {
      @extend .flex;

      justify-content: flex-end;

      .select_date_box {
        margin-right: 16px;
      }
    }

    .entry_type {
      margin-right: 16px;
      -webkit-appearance: unset;
    }
    .entry_type_select {
      width: 80px;
      font-size: 16px;
      padding-top: 3px;

      option {
        width: 100%;
      }
    }

    .select_date_box {
      input[type="date"].input_date {
        cursor: pointer;
        &::-webkit-calendar-picker-indicator {
          background: url(../assets/img/calendar_icon.svg) no-repeat center;
          background-size: auto 20px;
        }
      }
    }
  }
  .content {
    flex: 1 1 auto;
    width: 100%;
    overflow-y: hidden;
    border-radius: 16px;
    box-shadow: 0 2px 16px 2px rgba(0, 0, 0, 0.1);
    padding-top: 50px;
    position: relative;
    background: white;

    .attendance_list {
      width: 100%;
      height: 100%;
      overflow-y: scroll;

      .attendance {
        width: 100%;
        min-height: 100%;
      }
      li {
        display: grid;
        grid-template-rows: 50px;
        // grid-template-columns: minmax(120px, 300px) minmax(200px, 500px) minmax(100px, 200px) 1fr;
        grid-template-columns: minmax(120px, 300px) minmax(200px, 500px) minmax(100px, 1fr);
        font-family: $spoqa;

        &:nth-child(odd) {
          background: $light_gray;
        }

        p {
          @extend .flex;
        }
      }
      ::v-deep .attend_category {
        width: 100%;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        overflow-y: scroll;
        
      &::-webkit-scrollbar { background: $m_gray; }

        p {
          color: white;
          font-size: 20px;
          font-weight: bold;
          padding-top: 1px;
          background: $m_gray;
        }
        .filter_align {
          @extend .text_hidden; 

          width: 24px;
          height: 24px;
          margin-left: 6px;
          margin-top: -1px;
          padding: 0;
          cursor: pointer;
          background: url(../assets/img/filter_align.svg) 0 0;
          background-size: auto 100%;
          background-position: 24px 0;
        }
        .filter_align-active {
          background: url(../assets/img/filter_align.svg) 0 0;
        }
      }
    }
  }
</style>