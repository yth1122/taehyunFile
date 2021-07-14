<template>
  <v-app>
    <div id="main">
      <div id="top_header">
        <input type="button" class="hamburger" value="메뉴 열기" @click="active_menu">
        <h1 class="header__title">연합시스템 {{$route.meta.title}}</h1>
      </div>

      <sideMenu :email="email"></sideMenu>
      <div class="overlay" @click="active_menu"></div>

      <router-view></router-view>
    </div>
  </v-app>
</template>

<script>
import sideMenu from './components/sidemenu'

export default {
  components: {
    sideMenu
  },data(){
   return{
     email:String
   }
  },
  methods: {
    active_menu: function() {
      let tg = document.getElementById('sidemenu');
      let overlay = document.querySelector('.overlay');
      tg.classList.toggle('active');
      overlay.classList.toggle('active');
      this.email=this.$store.state.user.email;
    },
  },
 
}
</script>

<style lang="scss">

@import "@/assets/font/font.scss";
@import "@/assets/css/global.scss";

#main {
  width: 100%;
  height: 100%;
  padding-top: 50px;
}
#top_header {
  @extend .flex;

  width: 100%;
  height: 50px;
  justify-content: flex-start;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  background: $m_black;

  .hamburger {
    @extend .text_hidden; 

    width: 32px;
    height: 32px;
    border: 0;
    padding: 0;
    margin-right: 8px;
    cursor: pointer;
    background: url(./assets/img/hamburger.svg) no-repeat center;
    background-size: 18px auto;
  }
  .header__title {
    padding-top: 1px;
    font-size: 18px;
    font-weight: bold;;
    line-height: 50px;
    color: white;
  }
}

.overlay {
  // display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: -100%;
    opacity: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.4);

  &.active {
    // display: block;
    left: 0;
    opacity: 1;
    transition: opacity 0.5s;
  }
}
</style>
