import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex)

const store= new Vuex.Store({
  
  state: {
    user:{},
    accessToken:null,
    menuName:'연합시스템 근태 관리',
    base_url:'http://dev.yeonhapsystem.co.kr:33333',
    api_url:'http://dev.yeonhapsystem.co.kr:33333',
  },
  mutations: {
    accessToken:function(state,token){
     if(token !== null){
        state.accessToken = token;
        localStorage.removeItem("jwtToken")
        localStorage.setItem("jwtToken",token); 
      }
      else{
        localStorage.removeItem("jwtToken");
        state.accessToken =null;
        state.user={};
      }
    },
  },
  actions: {
  },
  modules: {
   
  },/*plugins :[
    createPersistedState({
      paths:["state"]
     }),
   ]
   ,*/
})
export default store