import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".ts", ".js", ".vue", ".json"],
  },
  base: "./",
  plugins: [vue(), vuetify({ autoImport: true }), tsconfigPaths()],
  server: {
    host: "0.0.0.0", // これを追加
    port: 5173, // 必要に応じてポート番号を変更
  },
});
