import { CoreOptionsFilterForVue2 } from "./CoreOptionsFilterForVue2";
import { ICoreTemplate } from "../core-template/CoreTemplateVue2Config";
import coreTemplateReactConfig from "../core-template/CoreTemplateReactConfig";

/**
 * 过滤器 React
 *
 * @export
 * @class CoreOptionsFilter
 */
export class CoreOptionsFilterForReact extends CoreOptionsFilterForVue2 {

  /** override 生成原始配置 */
  public generateSourceModulesData(options: any, finalOptions: any, downloadConfigSource: any = '') {
    // 取单例配置
    let configDataVue = this.getConfigTemplateInstanceData().getConfig();

    if (downloadConfigSource) {
      configDataVue = downloadConfigSource;
    }

    // 转换正确JSON
    console.log('generateModulesRoute==', configDataVue);
    console.log('options==', options);
    console.log('finalOptions==', finalOptions);
    console.log('downloadConfigSource==', downloadConfigSource);

    // const configDataVueList = configDataVue.split(headerFlag);
    const configDataContent = '';
    // if (configDataVueList && configDataVueList.length) {
    //   configDataContent = configDataVueList[1];
    //   this.headerFlagFirst = configDataVueList[0];

    //   // 特殊标识
    //   configDataContent = configDataContent.replace(listIconFlag, listIconFlagRestore);
    //   configDataContent = configDataContent.replace(formIconFlag, formIconFlagRestore);
    //   configDataContent = configDataContent.replace(detailIconFlag, detailIconFlagRestore);
    //   configDataContent = configDataContent.replace(layoutFlag, layoutFlagRestore);
    //   configDataContent = configDataContent.replace(importFlag, importFlagRestore);
    //   configDataContent = configDataContent.replace(extFlag, extFlagRestore);

    //   // 所有句柄加上"
    //   configDataContent = configDataContent.replace(/path:/gi, '"path":');
    //   configDataContent = configDataContent.replace(/name:/gi, '"name":');
    //   configDataContent = configDataContent.replace(/component:/gi, '"component":');
    //   configDataContent = configDataContent.replace(/redirect:/gi, '"redirect":');
    //   configDataContent = configDataContent.replace(/meta:/gi, '"meta":');
    //   configDataContent = configDataContent.replace(/title:/gi, '"title":');
    //   configDataContent = configDataContent.replace(/icon:/gi, '"icon":');
    //   configDataContent = configDataContent.replace(/children:/gi, '"children":');

    //   // 去除引号
    //   configDataContent = configDataContent.replace(/'/gi, '"');

    //   // 还原特殊引号
    //   configDataContent = configDataContent.replace(/"@\/pages/gi, "'@/pages");
    //   configDataContent = configDataContent.replace(/index.vue"/gi, "index.vue'");

    //   configDataContent = configDataContent.replace(/ +/gi, '');
    //   configDataContent = configDataContent.replace(/[\r\n]/gi, '');

    //   // 清除临时内容
    //   configDataContent = configDataContent.replace(/],/gi, ']');
    //   configDataContent = configDataContent.replace(/];/gi, ']');
    //   configDataContent = configDataContent.replace(/},},{/gi, '}},{');
    //   configDataContent = configDataContent.replace(/},]},{/gi, '}]},{');
    //   configDataContent = configDataContent.replace(/]},]/gi, ']}]');
    //   configDataContent = configDataContent.replace(/},}]},{/gi, '}}]},{');
    //   configDataContent = configDataContent.replace(/},},]}]/gi, '}}]}]');

    //   try {
    //     configDataContent = JSON.parse(configDataContent);
    //     // console.log('Generate parsed content..', configDataContent);
    //   } catch (error) {
    //     console.log('Generate json parse error..', error);
    //   }
    // }

    return configDataContent;
  }

  /**
   * override 生成特定路由配置
   *
   * @param {{ type: import(} [options="./CoreTemplate"]
   *
   * @memberOf CoreOptionsFilter
   */
  public async generateModulesRoute(options: any, finalOptions: any) {
    // 生成原始配置
    const sourceModulesData = this.generateSourceModulesData(options, finalOptions);
    console.log('generateModulesRoute React ==', sourceModulesData);

    // 生成排除目录后的路由配置
    // const deletedTypeList = this.restoreSourceModulesRouterData(sourceModulesData, options, finalOptions);
    // // console.log('保留的目录==', deletedTypeList);

    // // 依据原始配置移除需要排除的目录
    // await this.excludeSouceDeleteFolder(deletedTypeList, options, finalOptions);

    // // 生成排除后的路由配置
    // const saveedList = await this.generateExcludeRouter(deletedTypeList, sourceModulesData, options, finalOptions);

    // // 保存路由配置文件
    // this.saveRouterFilter(saveedList, this.getConfigTemplateInstanceData().getConfig(), options, finalOptions);
  }

  /**
   * override 获取当前解析器配置
   *
   * @returns {ICoreTemplate}
   *
   * @memberOf CoreOptionsFilterForReact
   */
  public getConfigTemplateInstanceData(): ICoreTemplate {
    return coreTemplateReactConfig;
  }
}
