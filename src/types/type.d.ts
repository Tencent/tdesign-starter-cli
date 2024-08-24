export type SupportedTemplate = 'vue2' | 'vue3' | 'react' | 'miniProgram' | 'mobileVue';

export type SupportedTemplateSize = 'all' | 'lite'

export interface ITemplateContent {
  url: string;
  description: string;
  downloadUrl: string;
  fePermissionDownloadUrl?: string; // 下载前端权限模型的 适用于部分模板下载场景
  routerData: string;
}

export type CreatorOptions = {
  name: string;
  description?: string;
  type: SupportedTemplate;
  buildToolType: 'vite' | 'webpack' | 'farm';
  template: SupportedTemplateSize;
}
