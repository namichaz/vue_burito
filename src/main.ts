import { createApp } from "vue";
import "@/style.css";
import App from "@/presentation/views/App.vue";
import router from "@/router.ts";
import i18n from "@/presentation/lang/i18n.ts";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueScrollTo from "vue-scrollto";
import ElementPlus from "element-plus";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(ElementPlus);
app.use(pinia);
app.use(VueScrollTo, {
  duration: 500,
  easing: "linear",
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true,
});
app.mount("#app");
