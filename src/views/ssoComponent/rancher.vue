<template>
  <div class="sso-component-rancher">
    <iframe
      v-if="rancherUrl"
      :src="rancherUrl"
      frameborder="0"
      width="100%"
      height="100%"
      style="min-height: 800px;"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
    <div v-else>
      <button @click="redirectToRancher">容器管理工具</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const rancherUrl = ref('');

onMounted(async () => {
  window.open(import.meta.env.VITE_RANCHER_URL + "", "_blank");
});

const redirectToRancher = () => {
  window.open(import.meta.env.VITE_RANCHER_URL + "", "_blank");
};

</script>

<style scoped>
.sso-component-rancher {
  width: 100%;
  height: 100%;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
