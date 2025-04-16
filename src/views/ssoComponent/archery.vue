<template>
  <div class="sso-component-dashboard">
    <iframe
      v-if="archeryUrl"
      :src="archeryUrl"
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

const archeryUrl = ref('');
const router = useRouter();
const formLoading = ref(false);
const userToken  = getAccessToken()

onMounted(async () => {
  try {
    await request.get({ url: `/component-sso-proxy/sso-archery?token=${userToken}` });
    window.open("http://172.31.0.7:9123/oidc/callback", "_blank");
  } catch (error) {
    console.error("请求失败:", error);
  }
});

</script>

<style scoped>
.sso-component-dashboard {
  width: 100%;
  height: 100%;
}
</style>
