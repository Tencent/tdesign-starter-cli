import path from 'path';

import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import rollupTypescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert  { type: 'json' };
import copy from 'rollup-plugin-copy';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const extensions = ['.js', '.ts'];

const external = Object.keys(pkg.dependencies || '');
const globals = external.reduce((prev, current) => {
  const newPrev = prev;
  newPrev[current] = current;
  return newPrev;
}, {});

const defaultConfig = {
  input: pkg.main,
  output: {
    file: path.join(__dirname, pkg.lib),
    format: 'es',
    banner: '#!/usr/bin/env node',
    globals
  },
  external,
  plugins: [
    rollupTypescript({
      exclude: 'node_modules/**',
      typescript,
      tsconfig: './tsconfig.json'
    }),
    json(),
    terser(),
    nodeResolve({
      extensions,
      modulesOnly: true,
      // 查找和打包node_modules中的第三方模块
      customResolveOptions: {
        moduleDirectories: ['src']
      },
      preferBuiltins: true
    }),
    babel({
      exclude: 'node_modules/**',
      extensions
    }),
    // 复制templates文件; 复制 .gitignore 文件；添加.npmignore文件："!.gitignore\n.npmignore"
    copy({
      targets: [
        'templates/vite/vue-lite',
        'templates/vite/vue-next-lite',
        'templates/vite/react-lite',
        'templates/webpack/vue-lite',
        'templates/webpack/vue-next-lite',
        'templates/webpack/react-lite'
      ]
        .map((filePath) => [
          {
            src: [`${filePath}/*`, `${filePath}/.gitignore`, `!${filePath}/node_modules`],
            dest: `bin/${filePath}`
          },
          {
            src: `${filePath}/.gitignore`,
            dest: `bin/${filePath}`,
            rename: '.npmignore',
            transform: () => Buffer.from('!.gitignore\n.npmignore', 'utf-8')
          }
        ])
        .flat(),
      verbose: true
    })
  ]
};

export default defaultConfig;
