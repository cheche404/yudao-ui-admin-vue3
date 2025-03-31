<template>
  <div class="ops-dashboard">
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

const queryParams = {
  responseType: 'code',
  clientId: '1074019084204507136',
  redirectUri: 'http://172.31.0.6/grafana/login/generic_oauth',
  state: Math.random().toString(36).substring(2),
  scopes: ['user.read'],
};

onMounted(async () => {
  // console.log("userToken", userToken)
  // grafanaUrl.value = await handleAuthorize(true);
  // grafanaUrl.value = "http://172.31.0.6/grafana/login/generic_oauth";
  const userToken = getAccessToken();
  const response = await request.get({url: `/grafana-proxy/sso?token=${userToken}` });
  grafanaUrl.value = "http://172.31.0.6/grafana";
});


</script>

<style scoped>
.ops-dashboard {
  width: 100%;
  height: 100%;
}
</style>
