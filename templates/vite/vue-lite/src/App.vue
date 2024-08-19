<template>
  <t-space direction="vertical" style="width: 100%; text-align: center">
    <t-space>
      <a href="https://tdesign.tencent.com/vue/overview" target="_blank">
        <img src="../public/tdesign-logo.svg" class="logo tdesign" alt="TDesign" />
      </a>
      <a href="https://vitejs.dev/" target="_blank">
        <img src="./assets/svg/vite-logo.svg" class="logo vite" alt="Vite" />
      </a>
    </t-space>
    <h2> Welcome to use
      <t-link size="large" theme="primary" href="https://tdesign.tencent.com/vue/overview" target="_blank">
        <jump-icon slot="suffixIcon" />
        TDesign-vue
      </t-link>
      +
      <t-link size="large" theme="primary" href="https://vitejs.dev/" target="_blank">
        <jump-icon slot="suffixIcon" />
        Vite
      </t-link>
      ！
    </h2>
    <h3>
      Experience it quickly using the
      <t-link theme="warning" href="https://tdesign.tencent.com/starter/vue/" target="_blank">
        <jump-icon slot="suffixIcon" />
        TDesign Starter
      </t-link>
      page template.
    </h3>

    <t-space>
      <t-button theme="primary">
        <add-icon slot="icon" />
        新建
      </t-button>
      <t-button variant="outline">
        <cloud-upload-icon slot="icon" />
        上传文件
      </t-button>
      <t-button shape="circle" theme="primary">
        <discount-icon slot="icon" />
      </t-button>
      <t-button shape="circle" theme="primary">
        <cloud-download-icon slot="icon" />
      </t-button>
      <t-button variant="outline"> 搜索 </t-button>
    </t-space>
  </t-space>
</template>

<script>
import Vue from "vue";
import {
  AddIcon,
  CloudUploadIcon,
  DiscountIcon,
  CloudDownloadIcon,
  JumpIcon
} from "tdesign-icons-vue";

export default Vue.extend({
  components: {
    AddIcon,
    CloudUploadIcon,
    DiscountIcon,
    CloudDownloadIcon,
    JumpIcon
  },
});
</script>

<style>
.logo {
  height: 6em;
  padding: 3em 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.tdesign:hover {
  filter: drop-shadow(0 0 2em #194de9);
}

.logo.vite:hover {
  filter: drop-shadow(0 0 2em #bd34fe);
}
</style>
