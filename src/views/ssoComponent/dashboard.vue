<template>
  <div class="sso-component-dashboard">
    <iframe
      v-if="grafanaUrl"
      :src="grafanaUrl"
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


const grafanaUrl = ref('');

onMounted(async () => {
    grafanaUrl.value = import.meta.env.VITE_HUAWEI_GRAFANA_URL + '/login/generic_oauth'
    await new Promise(resolve => setTimeout(resolve, 500)); // 睡眠 0.5秒
    grafanaUrl.value = import.meta.env.VITE_HUAWEI_GRAFANA_URL + '/dashboards?orgId=1&kiosk=full&theme=light'
});


</script>

<style scoped>
.sso-component-dashboard {
  width: 100%;
  height: 100%;
}
</style>
