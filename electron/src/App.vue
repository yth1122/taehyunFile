<template>
  <v-app class='title'>
    <div class="seat">
      <v-dialog
        v-model="seat_dialog.open"
        content-class="seat-dialog"
        persistent
      >
        <v-card class="inner">
          <h1 class="dialog-title">자리 뽑기</h1>
          <div v-if='complete == false' class="select-seat-quantity">
            <v-text-field 
              label="자리 개수"
              class='seat-quantity' 
              v-model='seat'
              type="number"
              @keyup.enter='check'
              outlined clearable
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    class="close-dialog" 
                    @click="seat_dialog.open = false"
                    fab small outlined depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span class="tooltip">닫기</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    @click='check'
                    fab depressed small outlined
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </template>
                <span class="tooltip">다음</span>
              </v-tooltip>
            </v-card-actions>
          </div>
          <div class="set-candidate" v-if="complete == true">
            <v-text-field 
              label="이름"
              class='text' 
              v-model='name'
              outlined clearable
            ></v-text-field>
            <v-card-actions>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    class="reset-this-try" 
                    @click="reset"
                    fab small outlined depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span class="tooltip">다시 설정</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    class="close-dialog" 
                    @click="seat_dialog.open = false"
                    fab small outlined depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span class="tooltip">닫기</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    class="next-name" 
                    @click="pickSeat"
                    fab small outlined depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </template>
                <span class="tooltip">뽑기</span>
              </v-tooltip>
            </v-card-actions>

          </div>
          <div 
            v-if="randomNum != undefined"
            class="selected-seat-number" 
            @click="randomNum = undefined"
          >
            <b>{{ randomNum }}</b><br>
            {{ name }}
          </div>

        </v-card>
      </v-dialog>
      <v-alert 
        type="error" 
        class="alert-name"
        border="left"
        color="red lighten-1"
        :value="seat_dialog.alert.name"
        transition="fade-transition"
      >
        이름은 필수값입니다.
      </v-alert>

      <div class="seat-view" ref='pdfarea'>
        <div class="seat-title">
          연합시스템 자리선정 제비뽑기
          <div class="title-actions">
            <v-btn 
              class="btn open-picker"
              @click='seat_dialog.open = true'
              depressed outlined
            >뽑기 열기</v-btn>
            <v-btn 
              class="btn pdf-download"
              @click='exportToPDF'
              depressed dark
            >pdf다운</v-btn>
          </div>
        </div>
        <div class="seat__content">

          <div class="seat__top">
            <p class="shower-booth">샤워실</p>
            <div class="seat-area">
              <ul class="seat-list">
                <li 
                  v-for="s, index in 40"
                  :key="'seat' + index"
                  class="seat"
                  :style="{order: 40 - index, }"
                >
                  <p class="seat-info seat-number">
                    {{ s }}
                  </p>
                  <p class="seat-info seat-owner" v-text="trim_seat[s]"></p>
                </li>
              </ul>
            </div>
            <p class="hallway">복도<br>방향</p>
          </div>

          <div class="seat__bottom">
            <div class="window-side">창가</div>
          </div>

        </div>

      </div>

    </div>
  </v-app>
</template>

<script>
import html2pdf from 'html2pdf.js'
export default {
  name: 'App',
  data() {
    return {
      seatList:[],
      seatNum:[],
      seat: 40,
      trim_seat: [],
      complete:false,
      name:null,
      randomNum:undefined,
      seat_dialog: {
        open: true,
        alert: {
          name: false,
        }
      }
    };
  },
  mounted(){
    document.documentElement.style.overflowY = 'auto';
  },
  created(){
    document.title="연합시스템 자리뽑기";
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = "./favicon.png";
  },
  methods:{
    exportToPDF () {
      //window.scrollTo(0, 0);
      html2pdf(this.$refs.pdfarea, {
        margin: 0,
        filename: '연합시스템 자리배치.pdf',
        image: {type:"jpg", quality: 0.95},
        html2canvas: { scrollY: 0,scale:1, dpi: 300, letterRendering: true,},
        jsPDF: {orientation: 'portrait', unit: 'mm', format: 'a2', compressPDF: true}
      })
    }, 
    check(){
      this.seatList=[];
      this.seatNum=[];
      for(let i=1; i<Number(this.seat)+1; i++){
        this.seatNum.push(i);
      }
      this.complete=true;
    },
    async pickSeat(){
      let valid = this.userNameRule(this.name);
      if( !valid ) {
        this.seat_dialog.alert.name = true;
        setTimeout(() => { this.seat_dialog.alert.name = false; }, 2000);
        return;
      }

      const effect = setInterval(() => {
        this.randomNum = Math.floor(Math.random() * Number(this.seat-1)+1);
      }, 10);
      setTimeout(() => {
       const random = Math.floor(Math.random() * this.seatNum.length);

        clearInterval(effect);
        if(this.seatNum.length != 0) {
          this.randomNum = this.seatNum[random];
          this.seatNum.splice(random, 1);
          this.seatList.push({seat:this.randomNum,name:this.name});
        }else{
          alert('번호 끝');
        }
      }, 1 * 1000 + 1000); 

    },
    reset(){
      this.seatList=[];
      this.seatNum=[];
      this.trim_seat=[];
      this.complete = false;
    },
    userNameRule(v) {
      return v;
    }
  },
  watch: {
    seatList(newv, oldv) {
      for( let s = 0; s < newv.length; s++) {
        this.trim_seat[Number(newv[s].seat)] = newv[s].name;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/global.scss';

  .seat-view {
    width: 90%;
    margin: 50px auto 0;
    padding: 32px 32px 64px;

    @include relative-web1 {
      margin: 32px auto 0;
    }

    .seat-title {
      @extend .flex_row;

      justify-content: space-between;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 32px;

      .title-actions {

        .btn {
          padding-top: 2px;
        }
        .open-picker {
          margin-right: 8px;
        }
      }
    }

    .seat__content {
      border: 2px solid black;
    }
    .seat__top {
      @extend .flex_row;
      justify-content: stretch;
      position: relative;

      .shower-booth {
        width: 150px;
        height: fit-content;
        align-self: flex-start;
        border-right: 2px solid black;
        text-align: center;
        padding: 100px 0;
        font-size: 24px;
        font-weight: bold;
        position: relative;
        flex: 0 0 auto;

        &::after {
          content: '';
          display: block;
          width: 70%;
          height: 2px;
          background-color: black;
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .seat-area {
        height: 600px;
        padding: 0;
        margin: 48px;
        flex: 1 1 auto;

        @include relative-web1 {
          height: 500px;
        }

        .seat-list {
          @extend .flex_column;
          flex-wrap: wrap;
          align-content: center;
          align-items: inherit;
          width: 100%;
          height: 100%;
          padding: 0;
        }
        .seat {
          width: 105px;
          height: 120px;
          font-size: 28px;
          padding: 38px 16px 16px;
          border-bottom: 1px solid black;
          border-left: 1px solid black;
          background-color: white;

          @include relative-web1 {
            width: 80px;
            height: 100px;
            font-size: 24px;;
            padding: 32px 12px 12px;
          }

          &:nth-child(10n + 15) {
            margin-right: 48px;
          }
          &:nth-child(5n) {
            border-top: 1px solid black;
          }
          &:nth-child(-n + 35) { border-right: 1px solid black; }
          &:nth-child(-n + 30) { border-right: 0; }
          &:nth-child(-n + 25) { border-right: 1px solid black; }
          &:nth-child(-n + 20) { border-right: 0; }
          &:nth-child(-n + 15) { border-right: 1px solid black; }
          &:nth-child(-n + 10) { border-right: 0; }
          &:nth-child(-n + 5) { border-right: 1px solid black;}

          .seat-info {
            height: fit-content;
            text-align: center;
          }
          .seat-number {
            margin-bottom: 0;
            line-height: 0.8;
            font-weight: 600;
          }
          .seat-owner {
            font-size: 18px;
            margin: 6px 0 0;
            word-break: break-all;
            line-height: 1;

            @include relative-web1 {
              font-size: 14px;
            }
          }
        }
      }
      .hallway {
        padding: 60px 0;
        margin: 0;
        font-size: 24px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        font-weight: bold;
        border-top: 2px solid black;
        border-bottom: 2px solid black;
        background-color: white;
      }
    }

    .seat__bottom {
      
      .window-side {
        width: 100%;
        padding: 16px;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        border-top: 2px dotted black;
      }
    }
  }

  ::v-deep .seat-dialog {
    width: 280px;

    .inner {
      padding: 24px;
      position: relative;
    }
    .dialog-title {
      font-size: 21px;
      text-align: center;
      margin-bottom: 24px;
      font-weight: bold;
    }

    // .seat-quantity { }
    .selected-seat-number {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      color: white;
      font-size: 24px;
      font-weight: 400;
      text-align: center;
      padding-top: 60px;
      cursor: pointer;
      background: linear-gradient(to right top, transparent 10%, white) no-repeat left bottom;
      background-size: 5000% 5000%;
      
      @keyframes background-gradient {
        0% {
          background-position: 0 100%;
          color: white;
        }
        20% {
          color: white;
        }
        100% {
          background-position: 100% 0;
          color: black;
        }
      }
      animation-name: background-gradient;
      animation-duration: 1.5s;
      animation-fill-mode: forwards;

      b {
        font-size: 40px;
        font-weight: 600;
        position: relative;
        bottom: -8px;
      }
    }

    .close-dialog {
      margin-right: 6px;
    }
  }

  ::v-deep .alert-name {
    padding: 16px 24px;
    position: fixed;
    bottom: 10%;
    left: 50%;
    z-index: 999999999999;
    transform: translate(-50%, 0);
  }
  ::v-deep .tooltip {
    display: inline-block;
    padding: 4px 12px 2px;
  }
</style>
