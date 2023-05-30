export type SupportedTemplate = 'vue2' | 'vue3' | 'react' | 'miniProgram'| 'mobileVue' | string;

export type SupportedTemplateSize = 'all' | 'lite' 

export interface ITemplateContent {
  url: string;
  description: string;
  downloadUrl: string;
  fePermissionDownloadUrl?: string; // 下载前端权限模型的 适用于部分模板下载场景
  routerData: string;
}

/**
 * 模板地址
 */
export const templates: Record<SupportedTemplate, ITemplateContent> = {
  vue2: {
    url: 'https://github.com/Tencent/tdesign-vue-starter.git',
    description: 'TDesign Vue2 Starter',
    downloadUrl: 'direct:https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/tdesign-vue-starter?download=true',
    routerData: 'https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/vue-starter-router?download=true'
  },
  vue3: {
    url: 'https://github.com/Tencent/tdesign-vue-next-starter.git',
    description: 'TDesign Vue3 Starter',
    downloadUrl: 'direct:https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/tdesign-vue-next-starter?download=true',
    fePermissionDownloadUrl:
      'direct:https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/tdesign-vue-next-starter/fe-permission?download=true',
    routerData: 'https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/vue-next-starter-router?download=true'
  },
  react: {
    url: 'https://github.com/Tencent/tdesign-react-starter.git',
    description: 'TDesign React Starter',
    downloadUrl: 'direct:https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/tdesign-react-starter?download=true',
    routerData: 'https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/react-starter-router?download=true'
  },
  miniProgram: {
    url: 'https://github.com/Tencent/tdesign-miniprogram-starter-retail.git',
    description: 'TDesign MiniProgram Starter Retail',
    downloadUrl: 'direct:https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/tdesign-miniprogram-starter-retail?download=true',
    routerData: '' // don't need
  },
  mobileVue: {
    url: 'https://github.com/TdesignOteam/tdesign-mobile-vue-starter-chat.git',
    description: 'TDesign Mobile Starter Chat',
    downloadUrl: 'direct:https://service-5ds77c8c-1257786608.hk.apigw.tencentcs.com/release/tdesign-mobile-starter-chat?download=true',
    routerData: '' // don't need
  }
};
