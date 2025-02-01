<template>
  <div id="home">
    <v-btn @click="goToGoogleMap" variant="outlined"> Button </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goToGoogleMap = () => {
  router.push("/search");
};
</script>
<style lang="scss" scope>
#home {
  padding: 20px;
}
v-btn {
  border: solid 1px;
  padding: 5px;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
}
</style>
