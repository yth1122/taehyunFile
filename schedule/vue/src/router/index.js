import Vue from 'vue'
import VueRouter from 'vue-router'
import http from '@/custom/http.js'
import moment from "moment"
import store  from '@/store'
import axios from 'axios';
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)
Vue.use(VueRouter)

const getUrlParams =() =>{
  var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
} 

const routes = [
  {
    path: '/',
    name: 'attendanceManagement',
    component: () => import('../views/attendanceManagement.vue'),
    meta: {
      title: '근태 관리',
    },
  },
  {
    path: '/dayoff',
    name: 'dayoff',
    component: () => import('../views/dayoff_calendar.vue'),
    meta: {
      title: '연차 현황',
    },
  },
  {
    path: '/dayoff/admin', 
    name: 'dayoffAdmin',
    component: () => import('../views/dayoffAdmin.vue'),
    meta: {
      title: '연차 현황 - 관리자',
    },
  },
  {
    path: '/dayoff/admin/:id',
    name: 'dayoffAdminPersonal',
    component: () => import('../views/dayoffAdmin_personal.vue'),
    meta: {
      title: '개인 연차 현황 - 관리자' ,
    },
  },
]


const router = new VueRouter({
  routes,
  mode: 'history'
})
router.onReady((callback,err) => {
    if(store.state.accessToken!=null){
        axios.post('http://192.168.0.154:3001/yhs/auth/check',{jwt:store.state.accessToken}).then(result=>{
            store.state.user = result.data;
            store.state.user.exp = result.data.exp
            store.state.user.expire = moment(parseInt(result.data.exp) * 1000).format('YYYY-MM-DD HH:mm:ss');
            Vue.cookie.delete('jwt')
        }).catch(error =>{
            http.login();
            store.commit('accessToken',Vue.cookie.get('jwt'));
        });
    }
})


router.beforeEach((to,from,next)=>{
    var param = getUrlParams();
    if(param.token !=undefined){
      store.commit('accessToken',param.token);
    }
    if(store.state.accessToken ==null && to.path!==store.state.base_url){   
        http.login();
        store.commit('accessToken',Vue.cookie.get('jwt'));
    }else{
        next();
    }
})

export default router
