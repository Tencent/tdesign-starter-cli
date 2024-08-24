import inquirer, { QuestionCollection } from 'inquirer';
import { CreatorOptions } from '../types/type';

export class CoreInquirer {
  /**
   * 交互命令
   * @returns 命令行数组
   */
  public interactionsHandler() {
    // 提问模式
    const questions: QuestionCollection<Pick<CreatorOptions, 'name' | 'description' | 'type' | 'template'>> = [
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称：',
        validate: (input: string) => {
          if (!input) {
            return '请输入项目名称!';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入项目描述：',
        default: 'Base on tdesign-starter-cli'
      },
      {
        type: 'list',
        name: 'type',
        message: '选择模板类型：',
        choices: [
          { name: 'PC【Vue2】模板', value: 'vue2' },
          { name: 'PC【Vue3】模板', value: 'vue3' },
          { name: 'PC【React】模板', value: 'react' },
          { name: '移动端 【Vue3】即时通讯模板', value: 'mobileVue' },
          { name: '小程序 零售电商模板', value: 'miniProgram' }
        ],
        default: 'vue2' // 默认值为列表项编号，起始为 0
      }
    ];

    return inquirer.prompt(questions);
  }
}
