import Vue from 'vue';
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';

import App from './App.vue';

Vue.use(TDesign);

new Vue({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (h) => <App />,
}).$mount('#app');

// 如果需要修改包括classPrefix或修改具体组件的design token等功能， 请使用esm版本
// 以下为esm版本使用方式

// import Vue from 'vue';
// import TDesign from 'tdesign-vue/esm';
// import 'tdesign-vue/esm/style/index.js';

// import App from './App.vue';

// Vue.use(TDesign);

// new Vue({
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   render: (h) => (
//     <t-config-provider globalConfig={{ classPrefix: 't' }}>
//       <App />
//     </t-config-provider>
//   )
// }).$mount('#app');
