import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme:'',
    overlay:true,
    drawer:false,
    accessToken:null,
    enterprise:null,
    websocket:[],
    sender:null,
    edges:[],
    enterprise_id:null,
    machine_name:'',
   /*
    websocket_url: process.env.NODE_ENV==='development' ?  'ws://localhost:8080' : 'wss://edge-dot-centered-sight-237801.appspot.com',
     api_url: process.env.NODE_ENV==='development' ?  'http://localhost:8080' : 'https://apis-dot-centered-sight-237801.appspot.com',
    edge_api_url: process.env.NODE_ENV==='development' ?  'http://localhost:8080' : 'https://edge-dot-centered-sight-237801.appspot.com',
    gateway_api_url: process.env.NODE_ENV==='development' ?  'http://localhost:8082' : 'https://gateway-dot-centered-sight-237801.appspot.com',
    */
   websocket_url: process.env.NODE_ENV==='development' ?  'wss://edge-dot-centered-sight-237801.appspot.com': 'wss://edge-dot-centered-sight-237801.appspot.com',
  //  api_url: process.env.NODE_ENV==='development' ?  'https://apis-dot-centered-sight-237801.appspot.com' : 'https://apis-dot-centered-sight-237801.appspot.com',
   api_url: process.env.NODE_ENV==='development' ?  'http://localhost:8080' : 'https://apis-dot-centered-sight-237801.appspot.com',
   edge_api_url: process.env.NODE_ENV==='development' ?  'https://edge-dot-centered-sight-237801.appspot.com' : 'https://edge-dot-centered-sight-237801.appspot.com',
   gateway_api_url: process.env.NODE_ENV==='development' ?  'https://gateway-dot-centered-sight-237801.appspot.com' : 'https://gateway-dot-centered-sight-237801.appspot.com',
   apsapi_url:
     process.env.NODE_ENV==='development' ? 'http://localhost:3838' :  'http://localhost:3838',
  //  'https://apsapi.yhs.dev',
   
    base_url: process.env.NODE_ENV==='development' ?  '/' : '/',
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
      url:''
    }
  },
  mutations: {
    accessToken:function(state,token){
      if(token !== null){
        state.accessToken = token.token;
        localStorage.removeItem("jwtToken")
        localStorage.setItem("jwtToken",token.token);
      }else{
        localStorage.removeItem("jwtToken");
        state.accessToken =null;
        state.user={};
      }
    },
    enterprise:function(state,enterprise){
        state.enterprise = enterprise;
        localStorage.removeItem("enterprise")
        localStorage.setItem("enterprise",enterprise);
    },
    enterprise_id:function(state,enterprise_id){
      state.enterprise_id=enterprise_id;
      localStorage.setItem("enterprise_id",enterprise_id);
    },
    sender:function(state,sender){
      console.log(sender);
      state.sender = sender ;
    },
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget;
      state.socket.isConnected = true;
      state.socket.url = event.currentTarget.url;
      event.currentTarget.send(JSON.stringify({token:state.accessToken}));
    },
    SOCKET_ONCLOSE (state)  {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    }
  },
  actions: {
    // sendMessage: function(context, message) {

    // }
  }
})

