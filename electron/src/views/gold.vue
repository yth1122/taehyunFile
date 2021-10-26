<template>
  <v-app class='title'>
   <div>자리 뽑기</div>
    <v-card v-if='complete == false'>   
      <v-text-field  class='text' v-model='seat' @keyup.enter='check'>번</v-text-field>
      <v-btn @click='check'><v-icon>mdi-arrow-right-box </v-icon></v-btn>
    </v-card>
     <v-card v-if='complete == true'>   
      <v-text-field class='text' v-model='name' ></v-text-field>
      <v-btn @click="test" ><v-icon>mdi-arrow-right-box </v-icon></v-btn>
      <v-btn @click="reset"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-card>
    <div v-if="randomNum != undefined">{{randomNum}}  </div>

   
  
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      sidemenu: false,
      seatList:[],
      seat:0,
      complete:false,
      name:null,
      randomNum:undefined,
      headers: [
        {
          text: '번호',
          value: 'count',
          sortable: true,
          align: 'center',
          width: '8%'
        },
        {
          text: '이름',
          value: 'name',
          sortable: true,
          align: 'center',
          width: '8%'
        },
      ] 
    };
  },
  mounted(){
  },
  methods:{
    check(){
      this.seatList=[];
      if(this.seat != 0){
        this.complete=true;
        console.log(this.seat);
        for(let i=1; i<Number(this.seat)+1;i++){
          this.seatList[i]={count:i,name:null};
        }
      }else{
        alert('숫자를 입력해주세요');
      }
    },
    async test(){
      var randomNum =(Math.random()*this.seat).toFixed(0);
      if(randomNum == 0 ){
        return;
      }
      if(this.seatList[randomNum].name != null){
        this.randomNum=randomNum;
        return;
      }else{
        this.randomNum=randomNum;
        this.seatList[randomNum].name=this.name;
        this.name=null;
      } 
      
      console.log(this.name);
      console.log(this.seatList);
      console.log(this.$refs.table);
      // this.name=null;
    },
    reset(){
      this.complete = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/global.scss';
  .text{
    width:100px;
  }
  .table{
    margin-top:30px;
  }
  .tr{
    border:2px solid black;
    margin:5px;
  }
  .td{
    width:30px;
    border:2px solid black;
  }
  .header {
    flex: 0 0 auto !important;
  }
  .logout_btn {
    position: absolute;
    right: 24px;
  }

  ::v-deep .menu {
    margin-right: 8px;
    background-color: transparent !important;
  }
  .menu_list {
    padding: 0;
    
    .menu__i {
      
      &:hover {
        background: rgba(100, 148, 237, 0.4);
      }
    }
    a {
      display: block;
      padding: 16px;

      &.router-link-exact-active {
        background: rgba(100, 148, 237, 0.4);
      }
    }
    .text {
      margin-left: 12px;
      font-size: 14px;
      color: black;
    }
  }
  .header_text {
    font-weight: bold;
  }
</style>
