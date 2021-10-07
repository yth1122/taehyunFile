
import store from "@/store";

class Apis {

  constructor(service) {
    this.service = service;
  }

  /*redirectTo = ( document,path) => {
    document.location = path
  }*/

  get(path) {
    return this.service.request({
      method: 'GET',
      url: store.state.apsapi_url+path,
      responseType: 'json',
      validateStatus: function(status){ return status <= 403}
    })
  }
  patch(path, payload, callback) {
    return this.service.request({
      method: 'PATCH',
      url: store.state.apsapi_url+path,
      responseType: 'json',
      data: payload
    })
  }
  delete(path) {
    return this.service.request({
      method: 'DELETE',
      url: store.state.apsapi_url+path,
      responseType: 'json',
      validateStatus: function(status){ return status <= 403}
    })
  }

  post(path, payload) {
    if(payload === undefined){
      payload={};
    }
    if(store.state.sender !=null){
      payload.sender=store.state.sender;
    }
    return this.service.request({
      method: 'POST',
      url: store.state.apsapi_url+path,
      responseType: 'json',
      validateStatus: function(status){ return status <= 403},
      data: payload
    })
  }
}

export default  Apis;
