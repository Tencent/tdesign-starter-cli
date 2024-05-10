import { defineConfig } from '@farmfe/core';
import { createVuePlugin } from "vite-plugin-vue2";

export default defineConfig({
  vitePlugins: [
    createVuePlugin()
  ]
});
