<template>
  <div id="dayoffAdmin">
    <div class="inner">

      <div class="filter">
        <div class="cm_round_box search_bar">
          <p class="cm_title">검색</p>
          <input type="text" class="input_text search_input" v-model="search">
          <input type="button" class="cm_button" value="검색">
        </div>
      </div>

      <div class="user_list_wrap">
        <div class="user_list_inner">
          <v-data-table
            :headers="userListHeader"
            :items="data"
            :search="search"
            :columns="columns"
            class="user_list"
            align="center"
            @update:items-per-page="get_item_per_page"
          >
            <!-- <template v-slot:item.link="{item}"> -->
            <template v-slot:item="{item}">
              <tr :style="{ 'borderColor': partColor[item.part] }">
                <td class="column text-xs-center">
                  <span class="inner">
                    {{ item.part }}
                  </span>
                </td>
                <td class="column text-xs-center">
                  <span class="inner">
                    {{ item.name }}
                  </span>
                </td>
                <td class="column text-xs-center">
                  <span class="inner">
                    {{ item.num }}
                  </span>
                </td>
                <td class="column text-xs-center pale_red">
                  <span class="inner">
                    {{ item.bal }}
                  </span>
                </td>
                <td class="column text-xs-center pale_blue">
                  <span class="inner">
                    {{ item.count }}
                  </span>
                </td>
                <td class="column text-xs-center">
                  <span class="inner">
                    {{ item.edate }}
                  </span>
                </td>
                <td class="column text-xs-center">
                  <span class="inner">
                    {{ item.per }}
                  </span>
                </td>
                <td class="column text-xs-center">
                  <span class="inner">
                    {{ item.mdate }}
                  </span>
                </td>
                <td class="column text-xs-center">
                  <span class="inner">
                    {{ item.comment }}
                  </span>
                </td>
                <td class="column text-xs-center">
                  <input type="button" class="action modify_btn" value="수정" @click="wid(item.id)">
                 <span @click="wid(item.id)"> <router-link :to="'/dayoff/admin/' + item.id" tag="button" class="action link_btn"  >상세 목록</router-link>
              </span>  </td>
              </tr>
            </template>
          </v-data-table>          
        </div>
      </div>

    </div>

    <!-- 군복무 팝업 -->
    <v-dialog v-model="popup_modify">
      <popup :show="'modify_dayoff'" :id="id" @datea="datea" :mdata="mdata" @close="popup_modify = false"></popup>
    </v-dialog>

  </div>
</template>

<script>
 import moment from 'moment'
  import popup from '../components/popup.vue';

export default {
  name: 'dayoffAdmin',
  components: {
    popup,
  },
  data() {
    return {
      search: '',
      userDepartment: {
        '생산기술': 'prodTech',
        '생산': 'prod',
        '공급망관리': 'supply',
        '기술연구소': 'techLab',
        '관리부': 'management',
        'IT': 'it',
      },
      userListHeader: [
        {
          text: '부서', 
          align: 'center',
          filterable: true,
          value: 'part',
          sortable: false
        },
        {text: '이름', value: 'name', sortable: false},
        {text: '생성 연차', value: 'num', sortable: false},
        {text: '남은 연차', value: 'count', sortable: false},
        {text: '사용 연차', value: 'bal', sortable: false},
        {text: '연차 소진일', value: 'edate', sortable: false},
        {text: '남은 일 수 대비 남은 연차', cvalue: 'per', sortable: false},
        {text: '군복무 만기일', value: 'mdate', sortable: false},
        {text: '비고', value: 'comment', sortable: false},
        {text: '수정/목록', value: 'link', sortable: false},
      ],
      columns: [
        'name',
        'num',
        'count',
        'bal',
        'edate',
        'per',
        'mdate',
        'comment',
        'link',
      ],
      id:String,
      data: [],
      partColor: {
        '생산기술': '#E46262',
        '생산': '#fcc863',
        '공급망관리': '#FFA1A1',
        '기술연구소': '#7ebc8c',
        '관리부': '#90CAE3',
        'IT': '#AC7BBD',
      },
      mdata:[],
      popup_modify: false,
    };
  },
  mounted:function(){
      this.datea();
  },
  methods: {
    wid(id){
        this.popup_modify = true;
        this.id=id;
        this.axios.get('http://192.168.0.154:3001/yhs/user/readm/'+this.id).then(r=>{
            this.mdata=r.data;
        })
    },
    datea(){
        this.axios.get('http://192.168.0.154:3001/yhs/user/dateall').then(r=>{
            for(let i=0;i<r.data.length;i++){
                r.data[i].edate=moment(r.data[i].edate).format('YYYY-MM-DD');
            }
            this.data=r.data;
        })
    },
    get_item_per_page(val) {
        let list = document.querySelector('.user_list');
        if( val == -1 ) {
            list.classList.add('all_scroll');
        }else{
            list.classList.remove('all_scroll');
        }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";

  #dayoffAdmin {
    @extend .flex;

    width: 100%;
    height: 100%;
    background: $m_pale;

    .inner {
      width: 95%;
      max-width: 1510px;

      @include relative-web {
        overflow: hidden;
      }
    }

    .filter {
      @extend .flex;

      justify-content: flex-end;
      margin-bottom: 24px;
    }

    .user_list_wrap {
      min-height: 565px;
      position: relative;
      background: white;
    }
    .user_list_inner {
      height: 100% !important;
    }

    ::v-deep .user_list {
      
      min-height: 585px;
      height: 100%;

      @extend .flex_col;
      justify-content: stretch;
      
      .v-data-table__wrapper {
        width: 100%;
        flex: 1 1 auto;
      }
      .v-data-footer {
        width: 100%;
        flex: 0 0 auto;
      }

      table {
        
        tr {
          display: grid;
          grid-template-columns: 150px 100px 100px 100px 100px 120px 200px 120px 250px 100px;
          grid-template-columns : minmax(120px, 1fr) 100px 100px 100px 100px minmax(120px, 1fr) minmax(130px, 1fr) minmax(120px, 1fr) minmax(200px, 1fr) 100px;

          @include relative-web {
            grid-template-columns: 130px 100px 100px 100px 100px 120px 120px 120px minmax(200px, 1fr) 100px;
          }

        }
      }
      thead {
        width: 100%;
        background: $m_blue;

        tr {
          border-left: 6px solid transparent;
        }
        th {
          @extend .flex;

          font-size: 16px;
          color: white;
          padding: 0;
          text-align: center;
          border-bottom: 0;

          span {
            display: inline-block;
            padding-top: 3px;
            margin-right: 3px;
            line-height: 1;
            text-align: center;
          }
        }
      }

      tbody {
        width: 100%;
        flex: 1 1 auto;

        tr {
          border-left: 6px solid white;
          box-sizing: border-box;
        }
        .column {
          @extend .flex;

          padding: 0;
          margin :0;

          .inner {
            display: inline-block;
            text-align: center;
          }
          
          &.pale_red { background: $pale_red; }
          &.pale_blue { background: $pale_blue; }

        }

        .action {
          @extend .text_hidden;

          width: 24px;
          height: 24px;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
          background: #eeeeee no-repeat center center;
          background-size: auto 14px;

          &.modify_btn {
            margin-right: 8px;
            background-color: $m_yellow !important;
            background-image: url('~@/assets/img/modify_black.svg');
            background-position: 8px center;
          }
          &.link_btn {
            background-color: $apple_green;
            background-image: url('~@/assets/img/link_black.svg');
            background-size: 12px auto;
          }
        }
      }

      // rows per page all 선택시
      &.all_scroll {
        height: 600px !important;
        position: realtive;
        padding-top: 48px;

        .v-data-table__wrapper {
          overflow-y: scroll;
        }
        table {
          height: auto !important;
          // overflow-y: scroll !important;
        }
        .v-data-table-header {
          position: absolute;
          top: 0;
          left: 0;
          overflow-y: scroll;

          &::-webkit-scrollbar { background: $m_blue; }
        }
        tbody {
          height: auto !important;
        }
      }
    }
  }

  ::v-deep .v-data-table__empty-wrapper {
    display: table-row !important;
    border-left: 0 !important;
    vertical-align: middle;
  }
</style>