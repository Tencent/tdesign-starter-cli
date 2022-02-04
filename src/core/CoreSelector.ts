import inquirer from 'inquirer';
import { SupportedTemplate, templates } from './CoreGitDownloader';

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
        message: '选择包括模块：',
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

      // 模拟得到下载内容

      // 让用户选择
      questions.push(
        {
          type: 'checkbox',
          name: 'seletTypes',
          message: '选择您需要生成的模块内容',
          choices: [
            'Alligators', 'Snakes', 'Turtles', 'Lizards',
          ],
        }
      );

      // 增加选择范围
      // 去除生成目录内容 .github  .husky .vscode
      // 添加原来的内容给下载目录选择
    } else {
      // TODO:
      console.log('TODO:待实现VUE3');
    }
    return inquirer.prompt(questions);

  }
}
