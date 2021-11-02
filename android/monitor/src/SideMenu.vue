<template>
    <view
      :style="{borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        backgroundColor: 'white',
        flex: 1}"
    >
      <view
        :style="{
          height: 200,
          backgroundColor: 'rgba(213,213,213,0.27)',
          borderTopRightRadius: 50,
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
                @click='fuck(data.idx)'>
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
import {Alert} from 'react-native'
export default {
  name: "myComponent",
  data(){
    return{
			list: [
        {
          idx: 0,
          title: '소개',
        },
        {
          idx: 1,
          title: '공지사항',
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
        {
          idx: 8,
          title: '로그아웃',
        },
			]
		}
  },
  components: {
  },
  methods:{
		fuck(){
			Alert.alert('fuck');
		}
  },
  mounted:function(){
  }
};
</script>
<style>

</style>
