import inquirer from 'inquirer';
import { SupportedTemplate, templates } from './CoreTemplate';
import axios from 'axios';
import { CoreOptionsFilterForVue2 } from './CoreOptionsFilter';
import { IParsedSourceData } from './CoreParsedConfig';
import coreTemplateVue2Config from './CoreTemplateVue2Config';

/**
 * 分段内容选择
 *
 * @export
 * @class CoreSelector
 */
export class CoreSelector {
  public async interactonsSelect(options: { type: SupportedTemplate, name: string, description: string }) {
    const { routerData } = templates[`${options.type || 'vue2'}`];
    const questions: Array<any> = [
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

    const result = await inquirer.prompt(questions);

    // console.log('result.==', result);
    if (result.selectSource !== 'all') {
      // TODO: 待实现自定义选择
      if (options.type === 'vue2') {
        // VUE2模板选择
        // console.log('download.==', routerData);

        // 下载模板config
        const downloadConfigSource = await this.downloadConfigData(routerData);
        // console.log('downloadConfigSource.==', downloadConfigSource);

        // 解析VUE2配置文件
        const parsedConfigData = this.parseConfigSourceVue2(downloadConfigSource);
        coreTemplateVue2Config.setParsedConfigData(parsedConfigData);

        const choiceList: Array<string> = [];
        parsedConfigData.filter((item: IParsedSourceData): any => {
          choiceList.push(item.meta.title);
        })

        // 让用户选择
        const questionsChoice: Array<any> = [
          {
            type: 'checkbox',
            name: 'seletTypes',
            message: '选择您需要生成的模块内容',
            choices: choiceList,
          }
        ];

        const resultChoice = await inquirer.prompt(questionsChoice);

        return resultChoice;

      } else {
        // TODO:
        console.log('TODO:待实现VUE3');
        return result;
      }
    } else {
      return result;
    }
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
   * 解析下载配置文件
   *
   * @param {string} routerData
   * @returns {string}
   *
   * @memberOf CoreSelector
   */
  public parseConfigSourceVue2(downloadConfigSource: string): any {
    const parsedResultData = new CoreOptionsFilterForVue2().generateSourceModulesData({}, {}, downloadConfigSource);

    // console.log('生成的内容==', parsedResultData);

    // 解析这种内容数据
    const parsedConfigDataTemp = [];
    for (let index = 0; index < parsedResultData.length; index++) {
      const elementResultData: any = parsedResultData[index];
      parsedConfigDataTemp.push({
        path: elementResultData.path,
        name: elementResultData.name,
        meta: elementResultData.meta,
      });
    }

    // console.log('解析后的的内容==', parsedConfigDataTemp);

    return parsedConfigDataTemp;
  }
}
