import { IParsedSourceData } from "../CoreParsedConfig";

/**
 * 模板单例接口
 *
 * @export
 * @interface ICoreTemplate
 */
export interface ICoreTemplate {
  /**
   * 获取解析的原始数据结构配置
   *
   * @returns {Array<IParsedSourceData>}
   *
   * @memberOf ICoreTemplate
   */
  getParsedConfigData(): Array<IParsedSourceData>;

  /**
   * 设置解析的原始数据结构配置
   *
   * @param {Array<IParsedSourceData>} v
   *
   * @memberOf CoreTemplateVue2Config
   */
   setParsedConfigData(v: Array<IParsedSourceData>): void;

   /**
   * 设置配置
   *
   * @param {any} configData
   *
   * @memberOf CoreTemplateVue2Config
   */
  setConfig(configData: any): void;

  /**
   * 获取配置
   *
   * @returns {*}
   *
   * @memberOf CoreTemplateVue2Config
   */
   getConfig(): any;
}

class CoreTemplateVue2Config implements ICoreTemplate {

  private configData!: any;

  /** 解析的原始数据结构配置 */
  private parsedConfigData: Array<IParsedSourceData> = [];

  /**
	 * 配置服务单例
	 *
	 * @static
	 */
	public static getInstance(): CoreTemplateVue2Config {
		if (!CoreTemplateVue2Config.instance) {
			CoreTemplateVue2Config.instance = new CoreTemplateVue2Config();
		}

		return CoreTemplateVue2Config.instance;
	}

  /**
   * 获取解析的原始数据结构配置
   *
   * @returns {Array<IParsedSourceData>}
   *
   * @memberOf CoreTemplateVue2Config
   */
  public getParsedConfigData(): Array<IParsedSourceData> {
    return this.parsedConfigData;
  }

  /**
   * 设置解析的原始数据结构配置
   *
   * @param {Array<IParsedSourceData>} v
   *
   * @memberOf CoreTemplateVue2Config
   */
  public setParsedConfigData(v: Array<IParsedSourceData>): void {
    this.parsedConfigData = v;
  }

  /**
   * 设置配置
   *
   * @param {any} configData
   *
   * @memberOf CoreTemplateVue2Config
   */
  public setConfig(configData: any): void {
    this.configData = configData;
  }

  /**
   * 获取配置
   *
   * @returns {*}
   *
   * @memberOf CoreTemplateVue2Config
   */
  public getConfig(): any {
    if (!this.configData) {
      this.configData =
      `
      import Layout from '@/layouts';
      import ListIcon from '@/assets/assets-slide-list.svg';
      import FormIcon from '@/assets/assets-slide-form.svg';
      import DetailIcon from '@/assets/assets-slide-detail.svg';


      export default [
        {
          path: '/list',
          name: 'list',
          component: Layout,
          redirect: '/list/base',
          meta: { title: '列表页', icon: ListIcon },
          children: [
            {
              path: 'base',
              name: 'listBase',
              component: () => import('@/pages/list/base/index.vue'),
              meta: { title: '基础列表页' },
            },
            {
              path: 'card',
              name: 'listCard',
              component: () => import('@/pages/list/card/index.vue'),
              meta: { title: '卡片列表页' },
            },
            {
              path: 'filter',
              name: 'listFilter',
              component: () => import('@/pages/list/filter/index.vue'),
              meta: { title: '筛选列表页' },
            },
            {
              path: 'tree',
              name: 'listTree',
              component: () => import('@/pages/list/tree/index.vue'),
              meta: { title: '树状筛选列表页' },
            },
          ],
        },
        {
          path: '/form',
          name: 'form',
          component: Layout,
          redirect: '/form/base',
          meta: { title: '表单页', icon: FormIcon },
          children: [
            {
              path: 'base',
              name: 'formBase',
              component: () => import('@/pages/form/base/index.vue'),
              meta: { title: '基础表单页' },
            },
            {
              path: 'step',
              name: 'formStep',
              component: () => import('@/pages/form/step/index.vue'),
              meta: { title: '分步表单页' },
            },
          ],
        },
        {
          path: '/detail',
          name: 'detail',
          component: Layout,
          redirect: '/detail/base',
          meta: { title: '详情页', icon: DetailIcon },
          children: [
            {
              path: 'base',
              name: 'detailBase',
              component: () => import('@/pages/detail/base/index.vue'),
              meta: { title: '基础详情页' },
            },
            {
              path: 'advanced',
              name: 'detailAdvanced',
              component: () => import('@/pages/detail/advanced/index.vue'),
              meta: { title: '多卡片详情页' },
            },
            {
              path: 'deploy',
              name: 'detailDeploy',
              component: () => import('@/pages/detail/deploy/index.vue'),
              meta: { title: '数据详情页' },
            },
            {
              path: 'secondary',
              name: 'detailSecondary',
              component: () => import('@/pages/detail/secondary/index.vue'),
              meta: { title: '二级详情页' },
            },
          ],
        },
        {
          path: '/result',
          name: 'result',
          component: Layout,
          redirect: '/result/success',
          meta: { title: '结果页', icon: 'check-circle' },
          children: [
            {
              path: 'success',
              name: 'resultSuccess',
              component: () => import('@/pages/result/success/index.vue'),
              meta: { title: '成功页' },
            },
            {
              path: 'fail',
              name: 'resultFail',
              component: () => import('@/pages/result/fail/index.vue'),
              meta: { title: '失败页' },
            },
            {
              path: 'network-error',
              name: 'warningNetworkError',
              component: () => import('@/pages/result/network-error/index.vue'),
              meta: { title: '网络异常' },
            },
            {
              path: '403',
              name: 'warning403',
              component: () => import('@/pages/result/403/index.vue'),
              meta: { title: '无权限' },
            },
            {
              path: '404',
              name: 'warning404',
              component: () => import('@/pages/result/404/index.vue'),
              meta: { title: '访问页面不存在页' },
            },
            {
              path: '500',
              name: 'warning500',
              component: () => import('@/pages/result/500/index.vue'),
              meta: { title: '服务器出错页' },
            },
            {
              path: 'browser-incompatible',
              name: 'warningBrowserIncompatible',
              component: () => import('@/pages/result/browser-incompatible/index.vue'),
              meta: { title: '浏览器不兼容页' },
            },
          ],
        },
      ];
      `;

      return this.configData;
    }

    return this.configData;
  }

	private static instance: CoreTemplateVue2Config;
}

export default CoreTemplateVue2Config.getInstance();
