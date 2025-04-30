<template>
  <div class="sso-component-pinpoint">
    <iframe
      v-if="pinpointUrl"
      :src="pinpointUrl"
      frameborder="0"
      width="100%"
      height="100%"
      style="min-height: 800px;"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
    <div v-else>
      <button @click="redirectToPinpoint">Pinpoint</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const pinpointUrl = ref('');

onMounted(async () => {
  window.open('https://tracing-hw.digiwincloud.com.cn/main', "_blank");
});

const redirectToPinpoint = () => {
  // Redirect to the URL when the button is clicked
  window.open('https://tracing-hw.digiwincloud.com.cn/main', "_blank");
};


</script>

<style scoped>
.sso-component-pinpoint {
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
