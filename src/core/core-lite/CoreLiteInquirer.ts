import inquirer, { QuestionCollection } from 'inquirer';
import { CoreInquirer } from '../CoreInquirer';
import { CreatorOptions } from '../../types/type';

/**
 * 简化版询问器
 *
 * @export
 * @class CoreLiteInquirer
 */
export class CoreLiteInquirer extends CoreInquirer {
  /**
   * override 交互命令
   * @returns 命令行数组
   */
  public interactionsHandler() {
    const questions: QuestionCollection<Pick<CreatorOptions, 'name' | 'description' | 'type' | 'template'>> = [
      {
        type: 'list',
        name: 'template',
        message: '生成代码版本：',
        choices: [
          { name: ' Lite版本 (只包含TDesign的基本使用和项目工程)', value: 'lite' },
          { name: ' 通用模板版本', value: 'custom' }
        ],
        default: 'lite'
      }
    ];

    return inquirer.prompt(questions);
  }
}
