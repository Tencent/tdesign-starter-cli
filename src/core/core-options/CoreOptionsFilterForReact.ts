import { CoreOptionsFilterForVue2 } from "./CoreOptionsFilterForVue2";
import { ICoreTemplate } from "../core-template/CoreTemplateVue2Config";
import coreTemplateReactConfig from "../core-template/CoreTemplateReactConfig";
import { IParsedSourceData } from "../CoreParsedConfig";
import path from "path";
import del from "del";

/**
 * 过滤器 React
 *
 * @export
 * @class CoreOptionsFilter
 */
export class CoreOptionsFilterForReact extends CoreOptionsFilterForVue2 {

  /** override 生成原始配置 */
  public generateSourceModulesData(options: any, finalOptions: any, downloadConfigSource: any = '') {
    // REACT比较特殊，使用配置驱动
    const configDataContent: any = [
      {
        path: '/detail',
        name: 'detail',
        meta: {
          title: '详情页'
        }
      },
      {
        path: '/form',
        name: 'form',
        meta: {
          title: '表单类'
        }
      },
      {
        path: '/list',
        name: 'list',
        meta: {
          title: '列表页'
        }
      },
      {
        path: '/result',
        name: 'result',
        meta: {
          title: '结果页'
        }
      }
    ];

    return configDataContent;
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
    // hole finalOptions.selectTypes
    // 找出不在列表中的目录，即为需要排除内容
    const selectTypeList: Array<IParsedSourceData> = [];

    // 找出需要排除的
    const parsedConfigData = this.getConfigTemplateInstanceData().getParsedConfigData();
    for (let index = 0; index < parsedConfigData.length; index++) {
      const elementParsedData: IParsedSourceData = parsedConfigData[index];

      // 为空时代表要排除，返回值代表需要保留
      if (!this.checkFileNeedtoKeep(elementParsedData.meta.title, finalOptions)) {
        selectTypeList.push(elementParsedData);
      }
    }

    // 执行删除
    for (const iterator of selectTypeList) {
      const needToExcludeItem: IParsedSourceData = iterator;
      try {
        if (needToExcludeItem.name) {
          // 1.删除目录
          const delPath = path.join(`${process.env.PWD}/${options.name}`, `./src/pages/${this.firstUpperCase(needToExcludeItem.name)}`);
          await del(delPath);
          // console.log('delPath==', delPath);
          // 2.删除目录，还要删moudles模块内路由
          const delPathFile = path.join(`${process.env.PWD}/${options.name}`, `./src/router/modules/${needToExcludeItem.name}.ts`);
          await del(delPathFile);
          // console.log('delPathFile==', delPathFile);
        }
      } catch (error) {
        console.log('excludeModules error..', error);
      }
    }
  }

  /** 首字母大写 */
  public firstUpperCase(str: string) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
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
    // const sourceModulesData = this.generateSourceModulesData(options, finalOptions);
    // console.log('generateModulesRoute React ==', sourceModulesData);

    // 生成配置和需要截除内容

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
