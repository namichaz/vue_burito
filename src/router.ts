// src/router.ts
import { createRouter, createWebHistory } from "vue-router";
import App from "@/presentation/views/App.vue";
import hello from "@/components/HelloWorld.vue";

const routes = [
  { path: "/", component: App },
  { path: "/hello", component: hello },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
