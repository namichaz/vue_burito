<template>
  <v-btn @click="goToGoogleMap" variant="outlined"> Button </v-btn>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goToGoogleMap = () => {
  router.push("/search");
};
</script>
<style lang="scss" scope>
v-btn {
  border: solid 1px;
  padding: 5px;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
}
</style>
