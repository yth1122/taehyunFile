<template>
  <div id="sidemenu">
    <div class="login">
      <div class="profile">
        <div class="img_wrap">
          <img :src="$store.state.user.picture" class="profile_img">
        </div>
        <p class="name">{{$store.state.user.name}}</p>
      </div>
      <input type="button" value="로그아웃" @click="logout" class="logout">
    </div>
    <ul class="menu">
      <!-- 메뉴 반복 시작 | 활성화 시 .active 추가 -->
      <li class="menu__i" v-for="menu in menuData" :key="'menu-' + menu.class" > 
        <router-link :to="{ name: menu.path }" class="menu_link">
          <p class="icon" :style="{backgroundImage: 'url(' + menu.icon + ')'}">{{ menu.class }} icon</p>
          <p class="title">{{ menu.name }}</p>
        </router-link>
        
        <router-link :to="{ name: menu.settingSite }" class="setting_site_wrap">
          <div class="setting_site" v-if="menu.settingSite !== ''">
            <p class="setting_icon"></p>
          </div>
        </router-link>
      </li>
      <!-- 메뉴 반복 끝 -->
    </ul>
  </div>
</template>

<script>
export default {
  name: 'sideMenu',
  data() {
    return {
      menuData: [
        {
          name: '근태 관리',
          path: 'attendanceManagement',
          class: 'attendanceManagement',
          icon: require('/src/assets/img/attendance_icon.svg'),
          settingSite: ''
        },
        {
          name: '연차 현황',
          class: 'dayoffState',
          path: 'dayoff',
          icon: require('/src/assets/img/dayoff_icon.svg'),
          settingSite: 'dayoffAdmin'
        },
      ]
    }
  },
  methods:{
    logout(){
      this.$http.logout();
    },
  },
  watch:{
    email: function(val){
        //jin.hanbyeol@yhsbearing.com
        if(val !='jin.hanbyeol@yhsbearing.com'){
        this.menuData[1].settingSite='';
      }
    },
  },props:['email'],
}
</script>
<style lang="scss" scoped>
@import "../assets/css/global.scss";

  #sidemenu {
    width: 320px;
    height: 100%;
    transform: translateX(-100%);
    transition: all 0.5s;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
    background: $m_black;

    &.active {
      transform: translateX(0) !important;
      transition: all 0.5s;
    }

  }

  .login {
    @extend .flex;

    justify-content: flex-start;
    height: 60px;
    padding: 0 24px;
    position: relative;
    background: rgba(255, 255, 255, 0.1);

    .profile {
      @extend .flex;

      width: 100%;
      justify-content: flex-start;
    }
    .img_wrap {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 16px;
      background: $m_blue;
    }
      .profile_img {
       
        
        // display: block;
       
        width: 100%;
        height: auto;
        overflow:hidden;
      }
    .name {
      padding-top: 3px;
      font-weight: bold;
      color: white;
    }
    .logout {
      @extend .text_hidden; 

      width: 24px;
      height: 24px;
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      background: url(../assets/img/logout_icon.svg) no-repeat center;
      background-size: 16px auto;
    }
  }
  .menu {
    width: 100%;

    .menu__i {
      position: relative;
      border-left: 4px solid transparent;
      
      .menu_link {
        @extend .flex;
  
        width: 100%;
        height: 100%;
        justify-content: flex-start;
        padding: 24px;
        text-decoration: none;
      }
      .icon {
        @extend .text_hidden;

        width: 18px;
        height: 18px;
        margin-right: 16px;
        background: right center no-repeat;
        background-size: auto 100%;
      }
      .title {
        padding-top: 2px;
        color: white;
      }
      .setting_site_wrap {
        display: block;
        transform: translate(0, -50%);
        padding: 6px;
        margin-right: -6px;
        position: absolute;
        top: 50%;
        right: 24px;
        z-index: 4;

        // .setting_site {}
        .setting_icon {
          width: 18px;
          height: 18px;
          background: url(../assets/img/setting_icon.svg) center top no-repeat;
          background-size: 100% auto;
        }
      }

      &:hover, &.active {
        background: rgba(255, 255, 255, 0.1);
        border-left-color: $m_blue;

        .icon {
          background-position: left center;
        }
        .title {
          color: $m_blue;
        }
        .setting_icon {
          background-position: center bottom 1px;
        }
      }
    }
  }
</style>