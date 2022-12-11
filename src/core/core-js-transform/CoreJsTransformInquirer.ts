import inquirer from 'inquirer';
import { CoreInquirer } from '../CoreInquirer';

/**
 *
 * @export
 * @class CoreLiteInquirer
 */
export class CoreJsTransformInquirer extends CoreInquirer {
  /**
   * override 交互命令
   * @returns 命令行数组
   */
  public interactionsHandler() {
    const questions: Array<{ type: string; name: string; message: string; choices: Array<Record<string, string>>; default: string }> = [
      {
        type: 'list',
        name: 'lang',
        message: '语言版本选择',
        choices: [
          { name: 'TS版本', value: 'ts' },
          { name: 'JS版本', value: 'js' }
        ],
        default: 'ts'
      }
    ];

    return inquirer.prompt(questions);
  }
}
