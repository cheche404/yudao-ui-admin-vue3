<!--容器大屏-->
<template>
  <div class="sso-component-uptimekuma">
    <iframe
      :src="uptimekumaUrl"
      frameborder="0"
      width="100%"
      height="1200px"
      style="min-height: 800px;"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';


const uptimekumaUrl = ref('');

onMounted(async () => {
  uptimekumaUrl.value = 'http://172.31.0.7:3001'
});


</script>

<style scoped>
.sso-component-uptimekuma {
  width: 100%;
  height: 100%;
}
</style>
