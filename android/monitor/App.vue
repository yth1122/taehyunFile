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
        <back  />
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
            <sidemenu render-prop-fn="renderNavigationView" @picked='gg'  />
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
import React,{useRef , useState , useEffect} from "react";
import { WebView } from "react-native-webview";
// share kakao talk or message etc .. share.share({message:})
// Vibration.vibrate 
// BackHandler 뒤로가기 버튼 
import { StyleSheet,Button, DrawerLayoutAndroid, Text, View ,Alert,RefreshControl, SafeAreaView, ScrollView,Linking,Share,Vibration,BackHandler } from 'react-native';
import ActionBar from 'react-native-action-bar';
import sidemenu from './src/SideMenu.vue';
import refresh from './src/refresh.js';
import back from './src/back.js';
export default {
  name: "myComponent",
  data(){
    return{
      bool:false,
      url:'https://mon-dot-centered-sight-237801.an.r.appspot.com/',
      searchQuery:null,
      navigation:sidemenu,
      position:null,
      rightIcons:[
        //  {
        //     name: 'star',
        //     onPress: () => alert('Right Star !'),
        // },
        {
            name: 'phone',
            onPress: () => Linking.openURL(`tel:01066518393`),
            isBadgeLeft:true,
        },
        {
            image:require('./assets/share.png'),
            onPress: () => Share.share({message:'https://mon-dot-centered-sight-237801.an.r.appspot.com/'})
        },
        {
            name: 'flag',
            badge: '10',
            onPress: () => Vibration.vibrate(),
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
    refresh,
    back,
  },
  methods:{
    onPressLearnMore: function() {
      this.bool = true;
      // Alert.alert('hi');
    },
    open(){
      this.$refs.drawer.openDrawer();
    },
    gg(v){
      this.url = v;
      this.$refs.drawer.closeDrawer(); 
    },
    reload(){
      this.$forceUpdate();
    },
  },
  mounted(){
  },
  created(){
  },
  beforeDestroy(){
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
