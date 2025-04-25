<template>
  <div class="sso-component-dashboard">
    <iframe
      v-if="jumpserverUrl"
      :src="jumpserverUrl"
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

const jumpserverUrl = ref('');

onMounted(async () => {
  try {
    window.open(import.meta.env.VITE_JUMPSERVER_URL + "/core/auth/openid/callback/", "_blank");
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
