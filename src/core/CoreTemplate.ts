

export type SupportedTemplate = 'vue2' | 'vue3';
export interface ITemplateContent { url: string, description: string, downloadUrl: string, routerData: string }

/**
 * 模板地址
 */
 export const templates: Record<SupportedTemplate, ITemplateContent> = {
  vue2: {
    url: 'https://github.com/Tencent/tdesign-vue-starter.git',
    description: 'TDesign Vue2 Starter',
    downloadUrl: 'github.com.cnpmjs.org:Tencent/tdesign-vue-starter#main',
    routerData: 'https://raw.githubusercontent.com/Tencent/tdesign-vue-starter/develop/src/router/modules/components.ts'
  },
  vue3: {
    url: 'https://github.com/Tencent/tdesign-vue-next-starter.git',
    description: 'TDesign Vue3 Starter',
    downloadUrl: 'github.com.cnpmjs.org:Tencent/tdesign-vue-next-starter#main',
    routerData: ''  // TODO: add vue3 router config
  }
};
