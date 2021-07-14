import axios from 'axios';
import store from "@/store"
class Http {
  
  constructor() {
    let service = axios.create({});
    
    service.interceptors.request.use((config) => {
        if(config.url.indexOf("/yhs/auth/")>-1){
          return config;
        }
        if(store.state.accessToken!=null){
            config.headers.common['Authorization'] = 'Bearer ' + store.state.accessToken
        }
      return config
    })
    service.interceptors.response.use((response,rr)=> {
        if(response.status === 401){
          store.commit('accessToken',null)
          if(document.location.pathname!==store.state.base_url){
            document.location = document.location.href.split("?")[0];
          }
          return;
        }
        return response;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });
    this.service = service;
  }

  login() {
    document.location=store.state.api_url+'/yhs/auth/login'
  }

  logout() {
    store.commit('accessToken',null);
    document.location.href=store.state.base_url;
  }
}

export default new Http;