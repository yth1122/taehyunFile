import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueNativeSock from 'vue-native-websocket'
import store from './store'
import http from '../components/http.js'
import cnc from '../components/cnchandler.js'
Vue.config.productionTip = false;
Vue.prototype.axios= axios;
Vue.prototype.$http =  http;
Vue.prototype.$cnc =  cnc;
Vue.config.productionTip = false;
var senderid = "/admin/id:"+(new Date().getTime());
Vue.use(VueNativeSock,store.state.websocket_url+senderid,{
  reconnection:true,
  reconnectionDelays:3000,
  connectManually: true,
  store:store,
  protocol:'transmitter'
})
if(localStorage.getItem("jwtToken")!=null){
  store.commit('accessToken',{token:localStorage.getItem("jwtToken")})
  store.commit('enterprise',localStorage.getItem("enterprise"))
  store.commit('enterprise_id',localStorage.getItem("enterprise_id"))
}
store.commit('sender',senderid)
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
