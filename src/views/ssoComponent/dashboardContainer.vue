<!--容器大屏-->
<template>
  <div class="sso-component-dashboard">
    <iframe
      v-if="isReady"
      :src="grafanaUrl"
      frameborder="0"
      width="100%"
      height="1200px"
      style="min-height: 800px;"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
    <div v-else>加载中...</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';


const grafanaUrl = ref('');
const isReady = ref(false);

onMounted(async () => {
  grafanaUrl.value = import.meta.env.VITE_GRAFANA_URL + '/login/generic_oauth'
  await new Promise(resolve => setTimeout(resolve, 500)); // 睡眠 0.5秒
  grafanaUrl.value = import.meta.env.VITE_GRAFANA_URL + '/d/common_container_monitor/rong-qi-jian-kong?orgId=1&kiosk=full&theme=light'
  isReady.value = true; // 标记准备好渲染
});


</script>

<style scoped>
.sso-component-dashboard {
  width: 100%;
  height: 100%;
}
</style>
