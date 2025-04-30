<template>
  <div class="sso-component-archery">
    <iframe
      v-if="archeryUrl"
      :src="archeryUrl"
      frameborder="0"
      width="100%"
      height="100%"
      style="min-height: 800px;"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
    <div v-else>
      <button @click="redirectToArchery">DB审核工具</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const archeryUrl = ref('');
onMounted(async () => {
  window.open(import.meta.env.VITE_ARCHERY_URL + "/oidc/callback", "_blank");
});

const redirectToArchery = () => {
  // Redirect to the URL when the button is clicked
  window.open(import.meta.env.VITE_ARCHERY_URL + "/oidc/callback", "_blank");
};

</script>

<style scoped>
.sso-component-archery {
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
