<template>
    <view
      :style="{
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        backgroundColor: 'white',
        flex: 1}"
    >
      <view
        :style="{
          height: 200,
          backgroundColor: 'rgba(213,213,213,0.27)',
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          paddingTop: 50,
          paddingLeft: 30,}
      ">
        <image
          :style="{height: 72, width: 72, borderRadius: 37}"  
          :source="{uri: 'https://mon-dot-centered-sight-237801.an.r.appspot.com/web/BAROFACTORY.png' }" 
        />
        <text
          :style="{
            marginTop: 15,
            fontSize: 26,
            fontWeight: 'bold',
            fontStyle: 'normal',
            lineHeight: 31,
            letterSpacing: 0,
            textAlign: 'left',
            color: '#272727',
            }">
          BaroFactory
        </text>
      </view>
      <view>
          <view v-for="data in list"
								:key="data.idx"
					>
            <touchable-opacity
              :style="{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5,
                paddingTop: 27,
                paddingLeft: 30,
                }"
                :on-press='()=>{
                  fuck(data)
                }'>
              <text
                :style="{
                  marginLeft: 12,
                  color: '#272727',
                  fontSize: 16,
                  lineHeight: 19,
                }">
                {{data.title}}
              </text>
            </touchable-opacity>
          </view>
      </view>
    </view>
</template>
<script>
import { Alert } from 'react-native'
export default {
  name: "myComponent",
  data(){
    return{
			list: [
        {
          idx: 0,
          title: 'APS',
          url:'https://aps.yhs.dev',
          checked:false,
        },
        {
          idx: 1,
          title: 'DT',
          url:'https://dt.yhs.dev',
          checked:false,
        },
        {
          idx: 2,
          title: 'Monitor',
          url:'https://mon-dot-centered-sight-237801.an.r.appspot.com/',
          checked:false,
        },
        {
          idx: 3,
          title: '공식사이트',
          url:'https://yhsbearing.co.kr/',
          checked:false,
        },
          {
          idx: 4,
          title: 'google',
          url:'https://google.com/',
          checked:false,
        },
         {
          idx: 5,
          title: 'YouTube',
          url:'https://www.youtube.com/',
          checked:false,
        },
        
			]
		}
  },
  components: {
  },
  methods:{
		fuck(v){
      if(v.url){
         this.$emit('picked',v.url);
      }else{
        alert('hello');
      }
     
		}
  },
  mounted:function(){
  }
};
</script>
<style>

</style>
