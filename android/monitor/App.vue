<template>
  <view class='container'>
    <view class='container' >
      <status-bar
            background-color="white"
            color="black"
            bar-style="dark-content"
        />
      <!-- <button 
        :on-press="onPressLearnMore"
        title="BaroFactory"
        color='black'
        ></button> -->
         <ActionBar
          containerStyle='styles.bar'
          backgroundColor="black"
          leftIconName='menu'
          :onLeftPress="open"
          :flat="true"
          :rightIcons="rightIcons" 
          :disableStatusBarHandling="false"
          />
          
          <!-- <DrawerLayoutAndroid v-if='bool' ref='drawer' 
            :drawerWidth="300"
            drawerPostion="Left"
          >
          <sidemenu render-prop-fn="rederNavigationView"></sidemenu>
          <slot></slot>
          </DrawerLayoutAndroid> -->
          <test/>


         <!-- <text class='title'>Android so difficult</text>  -->
          <web-view useWebKit={true}
            :source="{
              uri:url,
            }" 
          />
    </view>
  </view>  
</template>
<script>
import React,{useRef , useState} from "react";
import { WebView } from "react-native-webview";
import { StyleSheet,Button,RefreshControl, DrawerLayoutAndroid, Text, View ,Alert } from 'react-native';
import ActionBar from 'react-native-action-bar';
import sidemenu from './src/SideMenu.vue';
import test from './src/test.js';
const navigationView = sidemenu;
export default {
  name: "myComponent",
  data(){
    return{
      bool:false,
      url:'https://mon-dot-centered-sight-237801.an.r.appspot.com/',
      searchQuery:null,
      navigation:sidemenu,
      rightIcons:[
         {
            name: 'star',
            onPress: () => alert('Right Star !'),
        },
        {
            name: 'phone',
            onPress: () => alert('Right Phone !'),
            isBadgeLeft: true,
        },
        {
            name: 'plus',
            onPress: () => alert('Right Plus !'),
        },
        {
            name: 'flag',
            badge: '10',
            onPress: () => alert('Right Flag !'),
        },
      ]
    }
  }, 
  components: {
    "web-view": WebView,
    "button" :Button,
    "RefreshControl" : RefreshControl,
    "ActionBar" : ActionBar,
    "sidemenu" : sidemenu,
    "DrawerLayoutAndroid":DrawerLayoutAndroid,
    "navigationView":navigationView,
    "test":test
  },
  methods:{
    onPressLearnMore: function() {
      this.bool = true;
      // Alert.alert('hi');
    },
    open(){
      this.bool=true;
    },
    // onRefresh(){
    //   this.bool=true;
    //   this.bool=false;
    // },
  },
  mounted:function(){
  }
};
</script>
<style>
.title {
  text-align:center;
  height:3%;
}
.container {
  background-color: white;
  justify-content: center;
  flex: 1;
  width:100%;

}
.action{
}
.text-color-primary {
  color: blue;
}

</style>
