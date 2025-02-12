// src/router.ts
import { createRouter, createWebHistory } from "vue-router";
import Search from "@/presentation/views/Search.vue";
import Howto from "@/presentation/views/Howto.vue";
import Post from "@/presentation/views/Post.vue";
import List from "@/presentation/views/List.vue";

const routes = [
  { path: "/", component: Howto },
  { path: "/search", component: Search },
  { path: "/post", component: Post },
  { path: "/list", component: List },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
