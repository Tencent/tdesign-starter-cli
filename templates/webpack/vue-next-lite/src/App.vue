<template>
  <t-config-provider :global-config="{ classPrefix: 't' }">
    <t-space direction="vertical" style="width: 100%; text-align: center">
      <t-space>
        <a href="https://tdesign.tencent.com/vue-next/overview" target="_blank">
          <TDesignLogo class="logo tdesign" alt="TDesign" />
        </a>
        <a href="https://webpack.js.org/" target="_blank">
          <WebpackLogo class="logo webpack" alt="Webpack" />
        </a>
      </t-space>
      <h2> Welcome to use
        <t-link size="large" theme="primary" href="https://tdesign.tencent.com/vue-next/overview" target="_blank">
          <template #suffix-icon>
            <JumpIcon />
          </template>
          TDesign-vue-next
        </t-link>
        +
        <t-link size="large" theme="primary" href="https://webpack.js.org/" target="_blank">
          <template #suffix-icon>
            <JumpIcon />
          </template>
          Webpack
        </t-link>
        !
      </h2>

      <h3>
        Experience it quickly using the
        <t-link theme="warning" href="https://tdesign.tencent.com/starter/vue-next/" target="_blank">
          <template #suffix-icon>
            <JumpIcon />
          </template>
          TDesign Starter
        </t-link>
        page template.
      </h3>

      <t-space size="24px">
        <t-button theme="primary">
          <template #icon><add-icon /></template>
          新建
        </t-button>
        <t-button variant="outline">
          <template #icon><cloud-upload-icon /></template>
          上传文件
        </t-button>
        <t-button shape="circle" theme="primary">
          <template #icon><discount-icon /></template>
        </t-button>
        <t-button shape="circle" theme="primary">
          <template #icon> <cloud-download-icon /></template>
        </t-button>
        <t-button variant="outline"> 搜索 </t-button>
      </t-space>
    </t-space>
  </t-config-provider>
</template>

<!-- <script setup lang="ts"> -->
<script setup>
import {
  AddIcon,
  CloudUploadIcon,
  DiscountIcon,
  CloudDownloadIcon,
  JumpIcon
} from "tdesign-icons-vue-next";

import TDesignLogo from './assets/svg/tdesign-logo.svg';
import WebpackLogo from './assets/svg/webpack-logo.svg';

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

.logo.webpack:hover {
  filter: drop-shadow(0 0 2em #bd34fe);
}
</style>
