import path from "path";
import fs from 'fs';
import coreTemplateVue2Config from "./CoreTemplateVue2Config";
import { IParsedSourceData } from "./CoreParsedConfig";

// ===================== 拆分内容 ==============================
// 分离头部
const headerFlag = 'export default ';

// 特殊图标
const listIconFlag = new RegExp(/icon: ListIcon/ig);
const listIconFlagRestore = 'icon: "ListIcon"';

const formIconFlag = new RegExp(/icon: FormIcon/ig);
const formIconFlagRestore = 'icon: "FormIcon"';

const detailIconFlag = new RegExp(/icon: DetailIcon/ig);
const detailIconFlagRestore = 'icon: "DetailIcon"';

// layout falg
const layoutFlag = new RegExp(/component: Layout/ig);
const layoutFlagRestore = 'component: "Layout"';

// import flag
const importFlag = new RegExp(/\(\) => import\(/ig);
const importFlagRestore = '"() => import(';

// import flag
const extFlag = new RegExp(/\.vue'\)/ig);
const extFlagRestore = `.vue')"`;
// ===================== 拆分内容 ==============================


// ===================== 还原内容 ==============================
// 特殊图标
const listIconFlagBack = new RegExp(/icon: "ListIcon"/ig);
const listIconFlagRestoreBack = 'icon: ListIcon';

const formIconFlagBack = new RegExp(/icon: "FormIcon"/ig);
const formIconFlagRestoreBack = 'icon: FormIcon';

const detailIconFlagBack = new RegExp(/icon: "DetailIcon"/ig);
const detailIconFlagRestoreBack = 'icon: DetailIcon';

// layout falg
const layoutFlagBack = new RegExp(/component: "Layout"/ig);
const layoutFlagRestoreBack = 'component: Layout';

// import flag
const importFlagBack = new RegExp(/"\(\) => import\(/ig);
const importFlagRestoreBack = '() => import(';

// import flag
const extFlagBack = new RegExp(/\.vue'\)"/ig);
const extFlagRestoreBack = `.vue')`;
// ===================== 还原内容 ==============================

export interface IOptionsFilter {
  /**
   * 去除生成目录内容 .github  .husky .vscode
   *
   * @returns {Promise<any>}
   *
   * @memberOf IOptionsFilter
   */
  clearUnusedDirectorys(options: any, finalOptions: any): Promise<any>;

  /**
   * 排除模块
   *
   * @param {*} options
   * @param {*} finalOptions
   * @returns {*}
   *
   * @memberOf IOptionsFilter
   */
  excludeModules(options: any, finalOptions: any): any;

  /**
   * 生成原始配置
   *
   * @param {*} options
   * @param {*} finalOptions
   * @returns {*}
   *
   * @memberOf IOptionsFilter
   */
   generateModulesRoute(options: any, finalOptions: any): any;
}

/**
 * 过滤器 VUE2
 *
 * @export
 * @class CoreOptionsFilter
 */
export class CoreOptionsFilterForVue2 implements IOptionsFilter {

  /**
   * 前部内容
   *
   * @private
   * @type {string}
   * @memberOf CoreOptionsFilter
   */
  private headerFlagFirst = '';

  /**
   * 去除生成目录内容 .github  .husky .vscode
   *
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async clearUnusedDirectorys(options: any, finalOptions: any): Promise<any> {
    try {
      fs.unlinkSync(path.join(options.name, '.github'));
      fs.unlinkSync(path.join(options.name, '.husky'));
      fs.unlinkSync(path.join(options.name, '.vscode'));
    } catch (error) {
      console.log('clearUnusedDirectorys..', error);
    }
  }


  /**
   * 排除不用内容
   *
   * @param {{ type: SupportedTemplate, name: string, description: string }} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
   public async excludeModules(options: any, finalOptions: any) {
    // hole finalOptions.seletTypes
    // 找出不在列表中的目录，即为需要排除内容
    const selectTypeList: Array<IParsedSourceData> = [];
    // 找出需要保留的
    for (let index = 0; index < finalOptions.seletTypes.length; index++) {
      const elementSelectTypeItem: string = finalOptions.seletTypes[index];
      const addToExcludeItem: IParsedSourceData = this.checkNeedToExclude(elementSelectTypeItem);

      selectTypeList.push(addToExcludeItem);
    }

    // 找出需要排除的
    for (let index = 0; index < selectTypeList.length; index++) {
      const needToExcludeItem: IParsedSourceData = selectTypeList[index];
      try {
        if (needToExcludeItem.name) {
          fs.unlinkSync(path.join(options.name, `./src/pages/${needToExcludeItem.name}`));
        }
      } catch (error) {
        console.log('excludeModules error..', error);
      }
    }
  }

  /**
   * 检测是否在配置列表中
   *
   * @private
   * @param {string} elementSelectTypeItem
   * @returns {IParsedSourceData}
   *
   * @memberOf CoreOptionsFilter
   */
  public checkNeedToExclude(elementSelectTypeItem: string): IParsedSourceData {
    let parsedSourceData: IParsedSourceData = {isInExcludeList: false};

    const parsedConfigData = coreTemplateVue2Config.getParsedConfigData();
    for (let index = 0; index < parsedConfigData.length; index++) {
      const elementParsedData: IParsedSourceData = parsedConfigData[index];

      if (elementParsedData.meta.title === elementSelectTypeItem) {
        parsedSourceData = elementParsedData;
        parsedSourceData.isInExcludeList = true;
        break;
      }

    }

    return parsedSourceData;
  }

  /**
   * 生成特定路由配置
   *
   * @param {{ type: import(} [options="./CoreTemplate"]
   *
   * @memberOf CoreOptionsFilter
   */
  public async generateModulesRoute(options: any, finalOptions: any) {
    // 生成原始配置
    const sourceModulesData = this.generateSourceModulesData(options, finalOptions);

    // 生成排除目录后的路由配置
    const keepedTypeList = this.restoreSourceModulesRouterData(sourceModulesData, options, finalOptions);

    // 依据原始配置移除需要排除的目录
    this.excludeSouceDeleteFolder(keepedTypeList, options, finalOptions);

    // 生成排除后的路由配置
    const saveedList = this.generateExcludeRouter(keepedTypeList, sourceModulesData, options, finalOptions);

    // 保存路由配置文件
    this.saveRouterFilter(saveedList, coreTemplateVue2Config.getConfig(), options, finalOptions);
  }

  /** 生成原始配置 */
  public generateSourceModulesData(options: any, finalOptions: any, downloadConfigSource: any = '') {
    // const configDataVue = `import Layout from '@/layouts';
    // import ListIcon from '@/assets/assets-slide-list.svg';
    // import FormIcon from '@/assets/assets-slide-form.svg';
    // import DetailIcon from '@/assets/assets-slide-detail.svg';


    // export default [
    //   {
    //     path: '/list',
    //     name: 'list',
    //     component: Layout,
    //     redirect: '/list/base',
    //     meta: { title: '列表页', icon: ListIcon },
    //     children: [
    //       {
    //         path: 'base',
    //         name: 'listBase',
    //         component: () => import('@/pages/list/base/index.vue'),
    //         meta: { title: '基础列表页' },
    //       },
    //       {
    //         path: 'card',
    //         name: 'listCard',
    //         component: () => import('@/pages/list/card/index.vue'),
    //         meta: { title: '卡片列表页' },
    //       },
    //       {
    //         path: 'filter',
    //         name: 'listFilter',
    //         component: () => import('@/pages/list/filter/index.vue'),
    //         meta: { title: '筛选列表页' },
    //       },
    //       {
    //         path: 'tree',
    //         name: 'listTree',
    //         component: () => import('@/pages/list/tree/index.vue'),
    //         meta: { title: '树状筛选列表页' },
    //       },
    //     ],
    //   },
    //   {
    //     path: '/form',
    //     name: 'form',
    //     component: Layout,
    //     redirect: '/form/base',
    //     meta: { title: '表单页', icon: FormIcon },
    //     children: [
    //       {
    //         path: 'base',
    //         name: 'formBase',
    //         component: () => import('@/pages/form/base/index.vue'),
    //         meta: { title: '基础表单页' },
    //       },
    //       {
    //         path: 'step',
    //         name: 'formStep',
    //         component: () => import('@/pages/form/step/index.vue'),
    //         meta: { title: '分步表单页' },
    //       },
    //     ],
    //   },
    //   {
    //     path: '/detail',
    //     name: 'detail',
    //     component: Layout,
    //     redirect: '/detail/base',
    //     meta: { title: '详情页', icon: DetailIcon },
    //     children: [
    //       {
    //         path: 'base',
    //         name: 'detailBase',
    //         component: () => import('@/pages/detail/base/index.vue'),
    //         meta: { title: '基础详情页' },
    //       },
    //       {
    //         path: 'advanced',
    //         name: 'detailAdvanced',
    //         component: () => import('@/pages/detail/advanced/index.vue'),
    //         meta: { title: '多卡片详情页' },
    //       },
    //       {
    //         path: 'deploy',
    //         name: 'detailDeploy',
    //         component: () => import('@/pages/detail/deploy/index.vue'),
    //         meta: { title: '数据详情页' },
    //       },
    //       {
    //         path: 'secondary',
    //         name: 'detailSecondary',
    //         component: () => import('@/pages/detail/secondary/index.vue'),
    //         meta: { title: '二级详情页' },
    //       },
    //     ],
    //   },
    //   {
    //     path: '/result',
    //     name: 'result',
    //     component: Layout,
    //     redirect: '/result/success',
    //     meta: { title: '结果页', icon: 'check-circle' },
    //     children: [
    //       {
    //         path: 'success',
    //         name: 'resultSuccess',
    //         component: () => import('@/pages/result/success/index.vue'),
    //         meta: { title: '成功页' },
    //       },
    //       {
    //         path: 'fail',
    //         name: 'resultFail',
    //         component: () => import('@/pages/result/fail/index.vue'),
    //         meta: { title: '失败页' },
    //       },
    //       {
    //         path: 'network-error',
    //         name: 'warningNetworkError',
    //         component: () => import('@/pages/result/network-error/index.vue'),
    //         meta: { title: '网络异常' },
    //       },
    //       {
    //         path: '403',
    //         name: 'warning403',
    //         component: () => import('@/pages/result/403/index.vue'),
    //         meta: { title: '无权限' },
    //       },
    //       {
    //         path: '404',
    //         name: 'warning404',
    //         component: () => import('@/pages/result/404/index.vue'),
    //         meta: { title: '访问页面不存在页' },
    //       },
    //       {
    //         path: '500',
    //         name: 'warning500',
    //         component: () => import('@/pages/result/500/index.vue'),
    //         meta: { title: '服务器出错页' },
    //       },
    //       {
    //         path: 'browser-incompatible',
    //         name: 'warningBrowserIncompatible',
    //         component: () => import('@/pages/result/browser-incompatible/index.vue'),
    //         meta: { title: '浏览器不兼容页' },
    //       },
    //     ],
    //   },
    // ];`;
    // 存,存时空值判断
    if (downloadConfigSource) {
      coreTemplateVue2Config.setConfig(downloadConfigSource);
    }

    // 取
    let configDataVue = coreTemplateVue2Config.getConfig();

    if (downloadConfigSource) {
      configDataVue = downloadConfigSource;
    }

    // 转换正确JSON
    const configDataVueList = configDataVue.split(headerFlag);
    let configDataContent = '';
    if (configDataVueList && configDataVueList.length) {
      configDataContent = configDataVueList[1];
      this.headerFlagFirst = configDataVueList[0];

      // 特殊标识
      configDataContent = configDataContent.replace(listIconFlag, listIconFlagRestore);
      configDataContent = configDataContent.replace(formIconFlag, formIconFlagRestore);
      configDataContent = configDataContent.replace(detailIconFlag, detailIconFlagRestore);
      configDataContent = configDataContent.replace(layoutFlag, layoutFlagRestore);
      configDataContent = configDataContent.replace(importFlag, importFlagRestore);
      configDataContent = configDataContent.replace(extFlag, extFlagRestore);

      // 所有句柄加上"
      configDataContent = configDataContent.replace(/path:/ig, '"path":');
      configDataContent = configDataContent.replace(/name:/ig, '"name":');
      configDataContent = configDataContent.replace(/component:/ig, '"component":');
      configDataContent = configDataContent.replace(/redirect:/ig, '"redirect":');
      configDataContent = configDataContent.replace(/meta:/ig, '"meta":');
      configDataContent = configDataContent.replace(/title:/ig, '"title":');
      configDataContent = configDataContent.replace(/icon:/ig, '"icon":');
      configDataContent = configDataContent.replace(/children:/ig, '"children":');

      // 去除引号
      configDataContent = configDataContent.replace(/'/ig, '"');

      // 还原特殊引号
      configDataContent = configDataContent.replace(/"@\/pages/ig, "'@/pages");
      configDataContent = configDataContent.replace(/index.vue"/ig, "index.vue'");

      configDataContent = configDataContent.replace(/ +/ig, '');
      configDataContent = configDataContent.replace(/[\r\n]/ig, '');

      // 清除临时内容
      configDataContent = configDataContent.replace(/],/ig, "]");
      configDataContent = configDataContent.replace(/];/ig, "]");
      configDataContent = configDataContent.replace(/},},{/ig, "}},{");
      configDataContent = configDataContent.replace(/},]},{/ig, "}]},{");
      configDataContent = configDataContent.replace(/]},]/ig, "]}]");
      configDataContent = configDataContent.replace(/},}]},{/ig, "}}]},{");
      configDataContent = configDataContent.replace(/},},]}]/ig, "}}]}]");

      try {
        configDataContent = JSON.parse(configDataContent);
        console.log('generate parsed content..', configDataContent);
      } catch (error) {
        console.log('generate json parse error..', error);
      }
    }

    return configDataContent;
  }

  /**
   * 还原排除目录后的路由配置
   *
   * @private
   * @param {string} sourceModulesData
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  private restoreSourceModulesRouterData(sourceModulesData: string, options: any, finalOptions: any) {
     // 找出不在列表中的目录，即为需要排除内容
     const keepedTypeList: Array<IParsedSourceData> = [];
     // 找出需要保留的
     for (let index = 0; index < finalOptions.seletTypes.length; index++) {
       const elementSelectTypeItem: string = finalOptions.seletTypes[index];
       const addToExcludeItem: IParsedSourceData = this.checkNeedToExclude(elementSelectTypeItem);

       if (!addToExcludeItem.isInExcludeList) {
         keepedTypeList.push(addToExcludeItem);
       }
     }

     return keepedTypeList;
  }

  /**
   * 依据原始配置移除需要排除的目录
   *
   * @private
   * @param {string} sourceModulesData
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  private excludeSouceDeleteFolder(keepedTypeList: Array<IParsedSourceData>, options: any, finalOptions: any) {
    for (let index = 0; index < keepedTypeList.length; index++) {
      const element: IParsedSourceData = keepedTypeList[index];
      const elementPath = `${options.name}/src/pages`;
      try {
        fs.unlinkSync(path.join(elementPath, element.path || ''));
      } catch (error) {
        console.log('excludeSouceDeleteFolder..', error);
      }
    }
  }

  /**
   * 生成排除后的路由配置
   *
   *
   * @memberOf CoreOptionsFilter
   */
  private generateExcludeRouter(keepedTypeList: Array<IParsedSourceData>, sourceModulesData: any, options: any, finalOptions: any) {
    const saveedList = [];
    for (let indexKeepedTypeItem = 0; indexKeepedTypeItem < keepedTypeList.length; indexKeepedTypeItem++) {
      const elementKeepedTypeItem = keepedTypeList[indexKeepedTypeItem];

      for (let index = 0; index < sourceModulesData.length; index++) {
        const elementSourceItem = sourceModulesData[index];
        if (elementSourceItem.meta.title === elementKeepedTypeItem.meta.title) {
          saveedList.push(elementSourceItem);
          break;
        }
      }
    }

    return saveedList;
  }

  /**
   * 生成路由配置文件
   *
   * @private
   * @param {any[]} saveedList
   * @param {string} configData
   *
   * @memberOf CoreOptionsFilter
   */
  private saveRouterFilter(saveedList: any[], configData: string, options: any, finalOptions: any) {
    let configDataContent = JSON.stringify(saveedList);

    // 还原标识
    configDataContent = configDataContent.replace(listIconFlagBack, listIconFlagRestoreBack);
    configDataContent = configDataContent.replace(formIconFlagBack, formIconFlagRestoreBack);
    configDataContent = configDataContent.replace(detailIconFlagBack, detailIconFlagRestoreBack);
    configDataContent = configDataContent.replace(layoutFlagBack, layoutFlagRestoreBack);
    configDataContent = configDataContent.replace(importFlagBack, importFlagRestoreBack);
    configDataContent = configDataContent.replace(extFlagBack, extFlagRestoreBack);

    // 保留内容 {..export default...}
    const saveFileContent = `${this.headerFlagFirst}${headerFlag}${configDataContent}`;

    // 生成文件
    const elementPath = `${options.name}/src/`;
    try {
      fs.writeFileSync(path.join(elementPath,'router/modules/components.ts'), saveFileContent);
    } catch (error) {
      console.log('saveRouterFilter..', error);
    }
  }
}
