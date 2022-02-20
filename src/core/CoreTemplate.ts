

export type SupportedTemplate = 'vue2' | 'vue3';
export interface ITemplateContent { url: string, description: string, downloadUrl: string, routerData: string }

/**
 * 模板地址
 */
 export const templates: Record<SupportedTemplate, ITemplateContent> = {
  vue2: {
    url: 'https://github.com/Tencent/tdesign-vue-starter.git',
    description: 'TDesign Vue2 Starter',
    downloadUrl: 'direct:https://tencent-tdesign.coding.net/p/starter/d/tdesign-vue-starter/git/archive/develop/?download=true',
    routerData: 'https://raw.githubusercontent.com/Tencent/tdesign-vue-starter/develop/src/router/modules/components.ts'
  },
  vue3: {
    url: 'https://github.com/Tencent/tdesign-vue-next-starter.git',
    description: 'TDesign Vue3 Starter',
    downloadUrl: 'direct:https://tencent-tdesign.coding.net/p/starter/d/tdesign-vue-next-starter/git/archive/develop/?download=true',
    routerData: 'https://raw.githubusercontent.com/Tencent/tdesign-vue-next-starter/develop/src/router/modules/components.ts'
  }
};
