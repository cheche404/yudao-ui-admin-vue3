<template>
  <div class="sso-component-pinpoint">
    <iframe
      v-if="pinpointUrl"
      :src="pinpointUrl"
      frameborder="0"
      width="100%"
      height="100%"
      style="min-height: 800px;"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
    <div v-else>加载中...</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const pinpointUrl = ref('');

onMounted(async () => {
  pinpointUrl.value = 'https://tracing-hw.digiwincloud.com.cn/main'
});


</script>

<style scoped>
.sso-component-pinpoint {
  width: 100%;
  height: 100%;
}
</style>
