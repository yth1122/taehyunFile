import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import http from '@/custom/http.js'
import vuetify from './plugins/vuetify';
store.commit('accessToken',localStorage.getItem("jwtToken"));
Vue.config.productionTip = false
Vue.prototype.axios = axios;
Vue.prototype.$http = http;
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
