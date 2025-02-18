// src/router.ts
import { createRouter, createWebHistory } from "vue-router";
import Search from "@/presentation/views/Search.vue";
import Howto from "@/presentation/views/Howto.vue";
import Post from "@/presentation/views/Post.vue";
import List from "@/presentation/views/List.vue";

const routes = [
  { path: "/howto", name: "howto", component: Howto },
  { path: "/search", name: "search", component: Search },
  { path: "/post", name: "post", component: Post },
  { path: "/list", name: "list", component: List },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
