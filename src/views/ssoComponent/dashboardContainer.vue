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

// 获取 Cookie 的函数
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
};

onMounted(async () => {
  grafanaUrl.value = import.meta.env.VITE_HUAWEI_GRAFANA_URL + '/login/generic_oauth'
  await new Promise(resolve => setTimeout(resolve, 500)); // 睡眠 0.5秒
  grafanaUrl.value = import.meta.env.VITE_HUAWEI_GRAFANA_URL + '/d/common_container_monitor/rong-qi-jian-kong?orgId=1&kiosk=full&theme=light'
  isReady.value = true; // 标记准备好渲染

  // 获取 grafana_session Cookie
  const grafanaSession = getCookie('grafana_session');
  console.log('grafana_session:', grafanaSession);
});


</script>

<style scoped>
.sso-component-dashboard {
  width: 100%;
  height: 100%;
}
</style>
