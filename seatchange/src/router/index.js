import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('../App.vue'),
    meta: {
      title: '자리 뽑기',
    }
  },
 
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  
  routes
})

export default router
