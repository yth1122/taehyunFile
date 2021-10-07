
import store from "@/store";

class Login {

  constructor(service) {
    this.service = service;
  }

  /*redirectTo = ( document,path) => {
    document.location = path
  }*/

  login(path, payload) {
    if(payload === undefined){
      payload={};
    }
    if(store.state.sender !=null){
      payload.sender=store.state.sender;
    }
    return this.service.request({
      method: 'POST',
      url: store.state.gateway_api_url+path,
      responseType: 'json',
      validateStatus: function(status){ return status <= 401},
      data: payload
    })
  }

  logout() {
    store.commit('accessToken',null);
    this.service.request({
      method: 'GET',
      url: store.state.api_url+'/auth/oauth_logout',
      responseType: 'json',
    }).then(()=>{
        document.location.href=store.state.base_url;
    })
  }
}

export default  Login;
