import Vue from 'vue';
import TDesign from 'tdesign-vue';
import App from './App.vue';

Vue.use(TDesign);

new Vue({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (h) => (
    <div>
        <App />
    </div>
  ),
}).$mount('#app');
