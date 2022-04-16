import { IParsedSourceData } from "../CoreParsedConfig";
import { ICoreTemplate } from "./CoreTemplateVue2Config";

/**
 * React config
 *
 * @class CoreTemplateReactConfig
 */
class CoreTemplateReactConfig implements ICoreTemplate {

  private configData!: any;

  /** 解析的原始数据结构配置 */
  private parsedConfigData: Array<IParsedSourceData> = [];

  /**
	 * 配置服务单例
	 *
	 * @static
	 */
	public static getInstance(): CoreTemplateReactConfig {
		if (!CoreTemplateReactConfig.instance) {
			CoreTemplateReactConfig.instance = new CoreTemplateReactConfig();
		}

		return CoreTemplateReactConfig.instance;
	}

  /**
   * 获取解析的原始数据结构配置
   *
   * @returns {Array<IParsedSourceData>}
   *
   * @memberOf CoreTemplateReactConfig
   */
  public getParsedConfigData(): Array<IParsedSourceData> {
    return this.parsedConfigData;
  }

  /**
   * 设置解析的原始数据结构配置
   *
   * @param {Array<IParsedSourceData>} v
   *
   * @memberOf CoreTemplateReactConfig
   */
  public setParsedConfigData(v: Array<IParsedSourceData>): void {
    this.parsedConfigData = v;
  }

  /**
   * 设置配置
   *
   * @param {any} configData
   *
   * @memberOf CoreTemplateReactConfig
   */
  public setConfig(configData: any) {
    this.configData = configData;
  }

  /**
   * 获取配置
   *
   * @returns {*}
   *
   * @memberOf CoreTemplateReactConfig
   */
  public getConfig(): any {
    if (!this.configData) {
      this.configData =
      `import React, { lazy } from 'react';
      import { BrowserRouterProps } from 'react-router-dom';
      import dashboard from './modules/dashboard';
      import list from './modules/list';
      import form from './modules/form';
      import detail from './modules/detail';
      import result from './modules/result';
      import user from './modules/user';
      import login from './modules/login';

      export interface IRouter {
        path: string;
        redirect?: string;
        Component?: React.FC<BrowserRouterProps> | (() => any);
        /**
         * 当前路由是否全屏显示
         */
        isFullPage?: boolean;
        /**
         * meta未赋值 路由不显示到菜单中
         */
        meta?: {
          title?: string;
          Icon?: React.FC;
        };
        children?: IRouter[];
      }

      const routes: IRouter[] = [
        {
          path: '/login',
          Component: lazy(() => import('pages/Login')),
          isFullPage: true,
        },
        {
          path: '/',
          redirect: '/dashboard/base',
        },
      ];

      const otherRoutes: IRouter[] = [
        {
          path: '/403',
          Component: lazy(() => import('pages/Result/403')),
        },
        {
          path: '/500',
          Component: lazy(() => import('pages/Result/500')),
        },
        {
          path: '*',
          Component: lazy(() => import('pages/Result/404')),
        },
      ];

      const allRoutes = [...routes, ...dashboard, ...list, ...form, ...detail, ...result, ...user, ...login, ...otherRoutes];

      export default allRoutes;
      `;

      return this.configData;
    }

    return this.configData;
  }

	private static instance: CoreTemplateReactConfig;
}

export default CoreTemplateReactConfig.getInstance();
