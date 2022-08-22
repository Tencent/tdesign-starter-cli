import { createApp } from 'vue';

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';

import App from './App.vue';

const app = createApp(App);

app.use(TDesign);

app.mount('#app');

// 如果需要修改包括classPrefix或修改具体组件的design token等功能， 请使用esm版本
// 以下为esm版本使用方式

// import Vue from 'vue';
// import TDesign from 'tdesign-vue-next/esm';
// import 'tdesign-vue-next/esm/style/index.js';

// import App from './App.vue';

// const app = createApp(App);

// app.use(TDesign);

// app.mount('#app');
