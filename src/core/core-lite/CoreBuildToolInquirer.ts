import inquirer, { QuestionCollection } from 'inquirer';
import { CreatorOptions } from '../../types/type';

/**
 * 简化版询问器
 *
 * @export
 * @class CoreBuildToolInquirer
 */
export class CoreBuildToolInquirer {
  /**
   * override 交互命令
   * @returns 命令行数组
   */
  public interactionsHandler() {
    const questions: QuestionCollection<Pick<CreatorOptions, 'buildToolType'>> = [
      {
        type: 'list',
        name: 'buildToolType',
        message: '请选择构建工具',
        choices: [
          { name: ' vite', value: 'vite' },
          { name: ' webpack', value: 'webpack' },
          { name: ' farm', value: 'farm' }
        ],
        default: 'lite'
      }
    ];

    return inquirer.prompt(questions);
  }
}
