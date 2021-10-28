<template>
  <web-view :source="{uri:'https://mon-dot-centered-sight-237801.an.r.appspot.com/'}" 
            :style="{marginTop:25}"/>
</template>
<script>
import { WebView } from "react-native-webview";

export default {
  name: "myComponent",
  components: {
    "web-view": WebView
  }
};
</script>
<style>
.container {
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.text-color-primary {
  color: blue;
}
</style>
