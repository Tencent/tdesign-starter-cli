import path from "path";
import { SupportedTemplate } from "./CoreTemplate";
import fs from 'fs';
import { IParsedSourceData, parsedConfigData } from "./CoreSelector";
import { configData } from "./CoreTemplateVueConfig";

/**
 * 过滤器
 *
 * @export
 * @class CoreOptionsFilter
 */
export class CoreOptionsFilter {
  /**
   * 去除生成目录内容 .github  .husky .vscode
   *
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async clearUnusedDirectorys(options: any, finalOptions: any) {
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
        fs.unlinkSync(path.join(options.name, `./src/pages/${needToExcludeItem.name}`));
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
  private checkNeedToExclude(elementSelectTypeItem: string): IParsedSourceData {
    let parsedSourceData: IParsedSourceData = {};

    for (let index = 0; index < parsedConfigData.length; index++) {
      const elementParsedData: IParsedSourceData = parsedConfigData[index];

      if (elementParsedData.meta.title === elementSelectTypeItem) {
        parsedSourceData = elementParsedData;
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
    const configDataVue = `import Layout from '@/layouts';
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
    ];`;
    // const configDataVue = configData;

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

    // 转换正确JSON
    const configDataVueList = configDataVue.split(headerFlag);

    if (configDataVueList && configDataVueList.length) {
      let configDataContent = configDataVueList[1];

      // 去除引号
      configDataContent = configDataContent.replace(/'/ig, '"');

      // 还原特殊引号
      configDataContent = configDataContent.replace(/"@\/pages/ig, "'@/pages");
      configDataContent = configDataContent.replace(/index.vue"/ig, "index.vue'");

      // 特殊标识
      configDataContent = configDataContent.replace(listIconFlag, listIconFlagRestore);
      configDataContent = configDataContent.replace(formIconFlag, formIconFlagRestore);
      configDataContent = configDataContent.replace(detailIconFlag, detailIconFlagRestore);
      configDataContent = configDataContent.replace(layoutFlag, layoutFlagRestore);
      configDataContent = configDataContent.replace(importFlag, importFlagRestore);
      configDataContent = configDataContent.replace(extFlag, extFlagRestore);

      // 所有句柄加上"
      configDataContent = configDataContent.replace(/path/ig, '"path"');
      configDataContent = configDataContent.replace(/name/ig, '"name"');
      configDataContent = configDataContent.replace(/component/ig, '"component"');
      configDataContent = configDataContent.replace(/redirect/ig, '"redirect"');
      configDataContent = configDataContent.replace(/meta/ig, '"meta"');
      configDataContent = configDataContent.replace(/title/ig, '"title"');
      configDataContent = configDataContent.replace(/icon/ig, '"icon"');
      configDataContent = configDataContent.replace(/children/ig, '"children"');

      try {
        configDataContent = JSON.parse(configDataContent);
        console.log('generate parsed content..', configDataContent);
      } catch (error) {
        console.log('generate json parse error..', error);
      }
    }
  }
}
