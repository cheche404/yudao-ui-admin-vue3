<template>
  <div class="ops-dashboard">
    <iframe
      v-if="grafanaUrl"
      :src="grafanaUrl"
      frameborder="0"
      width="100%"
      height="100%"
      style="min-height: 800px;"
    ></iframe>
    <div v-else>加载中...</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as OAuth2Api from '@/api/login/oauth2';

const grafanaUrl = ref('');
const router = useRouter();
const formLoading = ref(false);

// OAuth2 参数，redirect_uri 使用后端代理地址
const queryParams = {
  responseType: 'code',
  clientId: '1074019084204507136',
  redirectUri: 'http://172.31.0.7:3000/login/generic_oauth', // 后端代理 Grafana 回调
  state: Math.random().toString(36).substring(2),
  scopes: ['user.read'],
};

onMounted(async () => {
  try {
    const query = router.currentRoute.value.query;
    if (query.code) {
      // 如果有 code，说明已授权完成，直接加载 Grafana
      grafanaUrl.value = 'http://172.31.0.7:3000';
    } else {
      // 未授权，自动触发授权，并获取 redirectUrl 赋值给 grafanaUrl.value
      const redirectUrl = await handleAuthorize(true);
      if (redirectUrl) {
        grafanaUrl.value = redirectUrl;
      }
    }
  } catch (error) {
    console.error('OAuth2 认证失败', error);
  }
});

// 复用授权逻辑
const handleAuthorize = async (approved) => {
  formLoading.value = true;
  try {
    const checkedScopes = approved ? queryParams.scopes : [];
    const uncheckedScopes = approved ? [] : queryParams.scopes;

    console.log("开始调用 doAuthorize");

    const response = await doAuthorize(false, checkedScopes, uncheckedScopes);
    console.log("doAuthorize 返回的结果：", response);
    return response;
  } catch (error) {
    console.error('授权失败', error);
  } finally {
    formLoading.value = false;
  }
  return null;
};



// 调用授权 API
const doAuthorize = (autoApprove, checkedScopes, uncheckedScopes) => {
  return OAuth2Api.authorize(
    queryParams.responseType,
    queryParams.clientId,
    queryParams.redirectUri,
    queryParams.state,
    autoApprove,
    checkedScopes,
    uncheckedScopes
  );
};
</script>

<style scoped>
.ops-dashboard {
  width: 100%;
  height: 100%;
}
</style>
