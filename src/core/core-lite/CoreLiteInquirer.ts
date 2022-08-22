import inquirer from 'inquirer';
import { CoreInquirer } from '../CoreInquirer';

/**
 * 简化板询问器
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
    const questions: Array<{ type: string; name: string; message: string; choices: Array<Record<string, string>>; default: string }> = [
      {
        type: 'list',
        name: 'type',
        message: '生成代码版本：',
        choices: [
          { name: ' Lite版本 (只包含初始化及基本使用)', value: 'lite' },
          { name: ' 通用模板版本', value: 'custom' }
        ],
        default: 'lite'
      }
    ];

    return inquirer.prompt(questions);
  }
}
