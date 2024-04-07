<template>
  <t-config-provider :global-config="{ classPrefix: 't' }">
    <t-space direction="vertical" style="width: 100%; text-align: center">
      <t-space>
        <a href="https://tdesign.tencent.com/vue-next/overview" target="_blank">
          <img :src="TDesignLogo" class="logo tdesign" alt="TDesign" />
        </a>
        <a href="https://vitejs.dev/" target="_blank">
          <img :src="ViteLogo" class="logo vite" alt="Vite" />
        </a>
      </t-space>
      <h2>tdesign-vue-next + vite</h2>
      <h3> Welcome to use
        <t-link theme="success" href="https://tdesign.tencent.com/vue-next/overview" target="_blank">
          <template #suffix-icon>
            <JumpIcon />
          </template>
          TDesign-vue-next
        </t-link>!
      </h3>
      <t-space>
        <t-button theme="primary">
          <add-icon />
          新建
        </t-button>
        <t-button variant="outline">
          <cloud-upload-icon />
          上传文件
        </t-button>
        <t-button shape="circle" theme="primary">
          <discount-icon />
        </t-button>
        <t-button shape="circle" theme="primary">
          <cloud-download-icon />
        </t-button>
        <t-button variant="outline"> 搜索 </t-button>
      </t-space>
    </t-space>
  </t-config-provider>
</template>

<script setup lang="ts">
import {
  AddIcon,
  CloudUploadIcon,
  DiscountIcon,
  CloudDownloadIcon,
  JumpIcon
} from "tdesign-icons-vue-next";
import TDesignLogo from './assets/svg/tdesign-logo.svg';
import ViteLogo from './assets/svg/vite-logo.svg';

</script>

<style>
.logo {
  height: 6em;
  padding: 3em 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #194de9);
}

.logo.vite:hover {
  filter: drop-shadow(0 0 2em #bd34fe);
}
</style>
