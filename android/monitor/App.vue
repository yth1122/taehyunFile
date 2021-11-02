<template>
  <view class='container'>
   <SafeAreaView> 
    <ScrollView>
    <refresh render-prop="refreshControl"/>
    </ScrollView>
   </SafeAreaView>
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
          <DrawerLayoutAndroid  ref='drawer' 
            :drawerWidth="300"
            drawerPostion="Left"
          >
            <sidemenu render-prop-fn="renderNavigationView"/>
            <web-view useWebKit={true}
              :source="{
                uri:url,
            }"/> 
          </DrawerLayoutAndroid>


         <!-- <text class='title'>Android so difficult</text>  -->
      
    </view>
  </view>
</template>
<script>
import React,{useRef , useState} from "react";
import { WebView } from "react-native-webview";
import { StyleSheet,Button, DrawerLayoutAndroid, Text, View ,Alert,RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import ActionBar from 'react-native-action-bar';
import sidemenu from './src/SideMenu.vue';
import refresh from './src/refresh.js';
export default {
  name: "myComponent",
  data(){
    return{
      bool:false,
      qqq:  <view >
            <text>I'm in the Drawer!</text>
          </view>,
      url:'https://mon-dot-centered-sight-237801.an.r.appspot.com/',
      searchQuery:null,
      navigation:sidemenu,
      position:null,
      rightIcons:[
         {
            name: 'star',
            onPress: () => alert('Right Star !'),
        },
        {
            name: 'phone',
            onPress: () => alert('Right Phone !'),
            isBadgeLeft:true,
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
    "ActionBar" : ActionBar,
    "sidemenu" : sidemenu,
    "DrawerLayoutAndroid":DrawerLayoutAndroid,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    refresh
  },
  methods:{
    onPressLearnMore: function() {
      this.bool = true;
      // Alert.alert('hi');
    },
    open(){
      this.bool=true;
      this.$refs.drawer.openDrawer()
    },
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
