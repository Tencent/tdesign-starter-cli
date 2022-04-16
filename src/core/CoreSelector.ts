import inquirer from 'inquirer';
import { SupportedTemplate, templates } from './CoreTemplate';
import axios from 'axios';
import { CoreOptionsFilterForVue2 } from './core-options/CoreOptionsFilterForVue2';
import { CoreOptionsFilterForVue3 } from './core-options/CoreOptionsFilterForVue3';
import { CoreOptionsFilterForReact } from './core-options/CoreOptionsFilterForReact';
import { IParsedSourceData } from './CoreParsedConfig';
import coreTemplateVue2Config from './core-template/CoreTemplateVue2Config';
import coreTemplateVue3Config from './core-template/CoreTemplateVue3Config';
import coreTemplateReactConfig from './core-template/CoreTemplateReactConfig';

/**
 * 分段内容选择
 *
 * @export
 * @class CoreSelector
 */
export class CoreSelector {
  /**
   * 处理选择交互-依据基本配置载下配置文件路由模板
   *
   * @param {{ type: SupportedTemplate, name: string, description: string }} options
   * @returns
   *
   * @memberOf CoreSelector
   */
  public async interactionsSelect(options: { type: SupportedTemplate; name: string; description: string }) {
    const { routerData } = templates[`${options.type || 'vue2'}`];
    const questions: Array<any> = this.generateStartQuestions();
    const result = await inquirer.prompt(questions);

    if (result.selectSource !== 'all') {
      // 现自定义选择下载
      if (options.type === 'vue2') {
        // ==================== VUE2模板选择

        // 下载模板config
        const downloadConfigSource = await this.downloadConfigData(routerData);

        // 解析VUE2配置文件
        const parsedConfigData = this.parseConfigSourceVue2(downloadConfigSource);
        coreTemplateVue2Config.setParsedConfigData(parsedConfigData);

        // 生成用户默认选中数据
        const choiceList: Array<string> = this.generateDefaultChoiceData(parsedConfigData);

        // 让用户选择
        const questionsChoice: Array<any> = this.generateChoiceList(choiceList);

        // 弹提示
        const resultChoice = await inquirer.prompt(questionsChoice);

        return resultChoice;
      } else if (options.type === 'vue3') {
        // ======================== VUE3模板选择

        // 下载模板config
        const downloadConfigSource = await this.downloadConfigData(routerData);

        // 解析VUE3配置文件
        const parsedConfigData = this.parseConfigSourceVue3(downloadConfigSource);
        coreTemplateVue3Config.setParsedConfigData(parsedConfigData);

        // 生成用户默认选中数据
        const choiceList: Array<string> = this.generateDefaultChoiceData(parsedConfigData);

        // 让用户选择
        const questionsChoice: Array<any> = this.generateChoiceList(choiceList);

        // 弹提示
        const resultChoice = await inquirer.prompt(questionsChoice);

        return resultChoice;
      } else if (options.type === 'react') {
        // ======================== REACT模板选择

        // 下载模板config
        const downloadConfigSource = await this.downloadConfigData(routerData);

        // 解析REACT配置文件
        const parsedConfigData = this.parseConfigSourceReact(downloadConfigSource);
        coreTemplateReactConfig.setParsedConfigData(parsedConfigData);

        // 生成用户默认选中数据
        const choiceList: Array<string> = this.generateDefaultChoiceData(parsedConfigData);

        // 让用户选择
        const questionsChoice: Array<any> = this.generateChoiceList(choiceList);

        // 弹提示
        const resultChoice = await inquirer.prompt(questionsChoice);

        return resultChoice;
      } else {
        // 默认
        return result;
      }
    } else {
      // 全量下载
      return result;
    }
  }

  /**
   * 解析下载配置文件REACT
   *
   * @param {string} routerData
   * @returns {string}
   *
   * @memberOf CoreSelector
   */
   public parseConfigSourceReact(downloadConfigSource: string): any {
    // 存,存时空值判断
    if (downloadConfigSource) {
      coreTemplateReactConfig.setConfig(downloadConfigSource);
    }
    const parsedResultData = new CoreOptionsFilterForReact().generateSourceModulesData({}, {}, downloadConfigSource);

    // 解析这种内容数据
    const parsedConfigDataTemp = [];
    for (let index = 0; index < parsedResultData.length; index++) {
      const elementResultData: any = parsedResultData[index];
      parsedConfigDataTemp.push({
        path: elementResultData.path,
        name: elementResultData.name,
        meta: elementResultData.meta
      });
    }

    return parsedConfigDataTemp;
  }

  /**
   * 生成用户默认选中数据
   *
   * @private
   * @param {*} parsedConfigData
   * @returns {*}
   *
   * @memberOf CoreSelector
   */
  private generateDefaultChoiceData(parsedConfigData: any): any {
    const choiceList: Array<string> = [];
    parsedConfigData.filter((item: IParsedSourceData): any => {
      choiceList.push(item.meta.title);
    });

    return choiceList;
  }

  /**
   * 生成选择您需要生成的模块内容询问格式
   *
   * @private
   * @param {Array<string>} choiceList
   * @returns {*}
   *
   * @memberOf CoreSelector
   */
  private generateChoiceList(choiceList: Array<string>): any {
    return [
      {
        type: 'checkbox',
        name: 'selectTypes',
        message: '选择您需要生成的模块内容',
        choices: choiceList
      }
    ];
  }

  /**
   * 开始语句
   *
   * @returns {any[]}
   *
   * @memberOf CoreSelector
   */
  private generateStartQuestions(): any[] {
    return [
      {
        // 是否选择全部
        type: 'list',
        name: 'selectSource',
        message: '选择包含模块：',
        choices: [
          { name: '全部', value: 'all' },
          { name: '自定义选择', value: 'custom' }
        ],
        default: 'all'
      }
    ];
  }

  /**
   * 下载配置文件
   *
   * @param {string} routerData
   * @returns {string}
   *
   * @memberOf CoreSelector
   */
  public async downloadConfigData(routerData: string): Promise<any> {
    let resData!: any;
    try {
      resData = await axios.get(routerData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('handleAxiosError==', error);
      } else {
        console.log('handleUnexpectedError==', error);
      }
    }

    return resData.data ? resData.data : resData;
  }

  /**
   * 解析下载配置文件VUE2
   *
   * @param {string} routerData
   * @returns {string}
   *
   * @memberOf CoreSelector
   */
  public parseConfigSourceVue2(downloadConfigSource: string): any {
    // 存,存时空值判断
    if (downloadConfigSource) {
      coreTemplateVue2Config.setConfig(downloadConfigSource);
    }
    const parsedResultData = new CoreOptionsFilterForVue2().generateSourceModulesData({}, {}, downloadConfigSource);

    // 解析这种内容数据
    const parsedConfigDataTemp = [];
    for (let index = 0; index < parsedResultData.length; index++) {
      const elementResultData: any = parsedResultData[index];
      parsedConfigDataTemp.push({
        path: elementResultData.path,
        name: elementResultData.name,
        meta: elementResultData.meta
      });
    }

    // console.log('解析后的的内容==', parsedConfigDataTemp);

    return parsedConfigDataTemp;
  }

  /**
   * 解析下载配置文件VUE3
   *
   * @param {string} routerData
   * @returns {string}
   *
   * @memberOf CoreSelector
   */
  public parseConfigSourceVue3(downloadConfigSource: string): any {
    // 存,存时空值判断
    if (downloadConfigSource) {
      coreTemplateVue3Config.setConfig(downloadConfigSource);
    }
    const parsedResultData = new CoreOptionsFilterForVue3().generateSourceModulesData({}, {}, downloadConfigSource);

    // 解析这种内容数据
    const parsedConfigDataTemp = [];
    for (let index = 0; index < parsedResultData.length; index++) {
      const elementResultData: any = parsedResultData[index];
      parsedConfigDataTemp.push({
        path: elementResultData.path,
        name: elementResultData.name,
        meta: elementResultData.meta
      });
    }

    return parsedConfigDataTemp;
  }
}
