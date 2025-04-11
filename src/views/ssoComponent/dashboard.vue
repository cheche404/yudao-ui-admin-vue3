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
import { useRouter } from 'vue-router';
import {getAccessToken} from "@/utils/auth";
import request from '@/config/axios'

const grafanaUrl = ref('');
const router = useRouter();
const formLoading = ref(false);
const userToken  = getAccessToken()

onMounted(async () => {
  try {
    await request.get({ url: `/component-sso-proxy/sso?token=${userToken}` });
    grafanaUrl.value = "http://172.31.0.6/grafana/dashboards?orgId=1&kiosk";
  } catch (error) {
    console.error("SSO 登录请求失败:", error);
  }
});


</script>

<style scoped>
.sso-component-dashboard {
  width: 100%;
  height: 100%;
}
</style>
