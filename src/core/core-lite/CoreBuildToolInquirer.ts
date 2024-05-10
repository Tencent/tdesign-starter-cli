import inquirer from 'inquirer';

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
    const questions: { type: string; name: string; message: string; choices: Array<Record<string, string>>; default: string }[] = [
      {
        type: 'list',
        name: 'type',
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
