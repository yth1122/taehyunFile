import React, { useRef, useState } from "react";
import { Button, DrawerLayoutAndroid, Text, StyleSheet, View,Image,TouchableOpacity,Alert } from "react-native";
import { WebView } from "react-native-webview";
import ActionBar from 'react-native-action-bar';
const App = () => {
  const drawer = useRef(null);
  const [drawerPosition] = useState("left");
  
  const mon_url = 'https://mon-dot-centered-sight-237801.an.r.appspot.com/';
  var aps_url = 'https://aps.yhs.dev/';
  var dt_url = 'https://dt.yhs.dev/';
  var url = mon_url;
  const list =  [
        {
          idx: 0,
          title: '소개',
        },
        {
          idx: 1,
          title: 'APS',
        },
        {
          idx: 2,
          title: '정보',
        },
        {
          idx: 3,
          title: '뉴스',
        },
        {
          idx: 4,
          title: '포인트',
        },
        {
          idx: 5,
          title: '초대',
        },
        {
          idx: 6,
          title: '고객센터',
        },
        {
          idx: 7,
          title: '설정',
        },
      ];
  
  const navigationView = () => (
    <View style={{borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      backgroundColor: 'white',
      flex: 1}}>
      <View style={{
          height: 200,
          backgroundColor: 'rgba(213,213,213,0.27)',
          borderTopRightRadius: 50,
          paddingTop: 50,
          paddingLeft: 30,}}
      >
        <Image
          style={{height: 72, width: 72, borderRadius: 37}}  
          source={{uri: 'https://mon-dot-centered-sight-237801.an.r.appspot.com/web/BAROFACTORY.png' }} 
        />
        <Text style={{
            marginTop: 15,
            fontSize: 26,
            fontWeight: 'bold',
            fontStyle: 'normal',
            lineHeight: 31,
            letterSpacing: 0,
            textAlign: 'left',
            color: '#272727',
        }}>
           BaroAdmin
        </Text>
      </View>  
      <View>
          {list.map(data => (
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 5,
                  paddingTop: 27,
                  paddingLeft: 30,
                }}
                onPress={() => {
                  data.idx === 1 ? url=aps_url : Alert.alert('Name', `${data.title}`);
                }}>
                <Text
                  style={{
                    marginLeft: 12,
                    color: '#272727',
                    fontSize: 16,
                    lineHeight: 19,
                  }}>
                  {data.title}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>  
    
    
    
    </View>
    
  );


  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
        <ActionBar
          containerStyle={styles.bar}
          backgroundColor={"black"}
          leftIconName={'menu'}
          onLeftPress={()=>drawer.current.openDrawer()}
          flat={true}
          rightIcons={[
            {
              name: 'star',
              onPress: () => Alert.alert('Right Star !'),
          },
          {
              name: 'phone',
              onPress: () => Alert.alert('Right Phone !'),
              isBadgeLeft: true,
          },
          {
              name: 'plus',
              onPress: () => Alert.alert('Right Plus !'),
          },
          {
              name: 'back',
              badge: '10',
              onPress: () => Alert.alert('Right Flag !'),
          },
          ]} 
          />   

      <WebView 
        source={{
          uri:url}}
      />
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: "center"
  }
});

export default App;