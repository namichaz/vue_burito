<template>
  <p>{{ text }}</p>
  <v-btn @click="submit" variant="outlined"> Button </v-btn>
  <ul v-for="user in users">
    <li>{{ user.name }}</li>
    <li>{{ user.email }}</li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
const submit = () => {
  text.value = "text2";
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
