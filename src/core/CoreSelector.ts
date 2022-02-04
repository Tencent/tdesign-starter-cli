import inquirer from 'inquirer';
import { SupportedTemplate, templates } from './CoreTemplate';

/**
 * 数据结构接口
 *
 * @export
 * @interface IParsedSourceData
 */
export interface IParsedSourceData {
  name: string;
  path: string;
  meta: any;
}

/** 解析的原始数据结构配置 */
export let parsedConfigData: Array<IParsedSourceData> = [];

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

    if (options.type === 'vue2') {
      // VUE2模板选择 TODO:
      console.log(routerData);

      // 下载模板config
      // const downloadConfigSource = await this.downloadConfigData(routerData);

      // 解析VUE2配置文件
      // parsedConfigData = this.parseConfigSourceVue2(downloadConfigSource);
      // TODO: TIPS模拟得到下载内容
      parsedConfigData = [
        // config flag
        {
          path: '/list',
          name: 'list',
          meta: { title: '列表页' },
        },
        // split flag
        {
          path: '/form',
          name: 'form',
          meta: { title: '表单页' },
        },
        // split flag
        {
          path: '/detail',
          name: 'detail',
          meta: { title: '详情页' }
        },
        // split flag
        {
          path: '/result',
          name: 'result',
          meta: { title: '结果页' },
        },
        // config flag
      ]

      const choiceList: Array<string> = [];
      parsedConfigData.filter((item: IParsedSourceData): any => {
        choiceList.push(item.meta.title);
      })

      // 让用户选择
      questions.push(
        {
          type: 'checkbox',
          name: 'seletTypes',
          message: '选择您需要生成的模块内容',
          choices: choiceList,
        }
      );

    } else {
      // TODO:
      console.log('TODO:待实现VUE3');
    }
    return inquirer.prompt(questions);

  }

  /**
   * 下载配置文件
   *
   * @param {string} routerData
   * @returns {string}
   *
   * @memberOf CoreSelector
   */
  // public downloadConfigData(routerData: string): string {
  //   // TODO:
  // }

  /**
   * 解析下载配置文件
   *
   * @param {string} routerData
   * @returns {string}
   *
   * @memberOf CoreSelector
   */
  // public parseConfigSourceVue2(downloadConfigSource: string): string {
  //   // TODO:
  // }
}
