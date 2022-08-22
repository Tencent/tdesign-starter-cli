import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from '@honkhonk/vite-plugin-svgr';

export default (params) => ({
  base: './',
  resolve: {
    alias: {},
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@prefix': 't', // 配合esm版本 支持修改less var
        },
      },
    },
  },

  plugins: [svgr(), react()],

  build: {
    cssCodeSplit: false,
  },
});
