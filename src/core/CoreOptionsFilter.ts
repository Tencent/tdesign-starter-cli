import path from "path";
import { SupportedTemplate } from "./CoreTemplate";
import fs from 'fs';
import { IParsedSourceData, parsedConfigData } from "./CoreSelector";

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
    throw new Error('Method not implemented.');
  }
}
