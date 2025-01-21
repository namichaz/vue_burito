// src/router.ts
import { createRouter, createWebHistory } from "vue-router";
import App from "@/presentation/views/App.vue";
import Gmap from "@/presentation/views/GoogleMap.vue";

const routes = [
  { path: "/", component: App },
  { path: "/gmap", component: Gmap },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
