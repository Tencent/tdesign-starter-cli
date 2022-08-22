import { loadEnv } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';

import path from 'path';

const CWD = process.cwd();

export default ({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);

  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      },
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

    plugins: [
      createVuePlugin({
        jsx: true,
      }),
      createSvgPlugin(),
    ],

    build: {
      cssCodeSplit: false,
    },
  };
};
