
import store from "@/store";

class Edge {

  constructor(service) {
    this.service = service;
  }

  /*redirectTo = ( document,path) => {
    document.location = path
  }*/

  post(path, payload) {
    if(payload === undefined){
      payload={};
    }
    if(store.state.sender !=null){
      payload.sender=store.state.sender;
    }
    return this.service.request({
      method: 'POST',
      url: store.state.edge_api_url+path,
      responseType: 'json',
      validateStatus: function(status){ return status <= 403},
      data: payload
    })
  }
}

export default  Edge;
