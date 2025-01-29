// src/router.ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/presentation/views/Home.vue";
import Search from "@/presentation/views/GoogleMap.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/search", component: Search },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
