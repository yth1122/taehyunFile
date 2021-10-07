import axios from 'axios';
import APIS from './http_apis';
import EDGE from './http_edge';
import LOGIN from './http_login';
import APS from './http_aps';
import store from "@/store";

class Http {

  constructor() {
    let service = axios.create({});

    service.interceptors.request.use((config) => {
        if(store.state.accessToken!=null){
            //config.headers.common['Authorization'] = 'Bearer ' + store.state.accessToken
            config.headers.common['x-access-token'] = store.state.accessToken
        }
      return config
    })
    service.interceptors.response.use((response,rr)=> {
        if(response.status === 401){
          console.log(rr)
          store.commit('accessToken',null)
          if(document.location.pathname!==store.state.base_url){
            document.location = document.location.href.split("?")[0];
          }
          return;
        }else if(response.status === 403){

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
    this.addService();
  }
  addService(){
    this.APIS = new APIS(this.service);
    this.LOGIN = new LOGIN(this.service);
    this.EDGE = new EDGE(this.service);
    this.APS = new APS(this.service);
  }
}

export default new Http;
