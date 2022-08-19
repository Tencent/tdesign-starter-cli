import inquirer from "inquirer";
import { CoreInquirer } from "../CoreInquirer";

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
    const questions: Array<any> = [
      {
        type: 'list',
        name: 'type',
        message: '生成代码版本：',
        choices: [
          { name: '【Lite】极简版', value: 'lite' },
          { name: '【Custom】自定义版', value: 'custom' }
        ],
        default: 'lite'
      }
    ];

    return inquirer.prompt(questions);
  }
}
