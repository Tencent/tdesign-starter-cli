/* eslint-disable no-case-declarations */
import chalk from 'chalk';
import clear from 'clear';
import ora from 'ora';
import figlet from 'figlet';
import { CoreSelector } from './CoreSelector';
import { CoreInquirer } from './CoreInquirer';
import { CoreGitDownloader } from './CoreGitDownloader';
import fs from 'fs';
import { CoreLiteInquirer } from './core-lite/CoreLiteInquirer';
import { CoreBuildToolInquirer } from './core-lite/CoreBuildToolInquirer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CoreJsTransformInquirer } from './core-js-transform/CoreJsTransformInquirer';

import type { SupportedTemplateSize } from './CoreTemplate';
import { CoreLiteDownloader } from './core-lite/CoreLiteDownloader';

class Creator {
  constructor() {
    clear();
    console.log('*****************************');
    console.log(chalk.green(figlet.textSync('TDesign Starter', { horizontalLayout: 'full' })));
    console.log('*****************************');
    console.log();

    const spinner = ora('👉 检查构建环境...').start();

    spinner.succeed(chalk.green('构建环境正常！'));
    console.log();
    this.init();
   
  }

  /**
   * 前置条件满足，进入子程序
   *
   *
   * @memberOf Creator
   */
  public async init() {
    // 1.基本配置数据获取
    const answer = await new CoreInquirer().interactionsHandler();

    if(['miniProgram', 'mobileVue'].includes(answer?.type)) {
      await new CoreGitDownloader().syncDownload(answer);
      return;
    }
   
    // 2.询问生成简化版还是自定义版本
    const listOptions: { type: SupportedTemplateSize; name: string; description: string } = await new CoreLiteInquirer().interactionsHandler();

    // 3.执行下载生成动作
    switch (listOptions.type) {
      case 'lite':
        // 极简版本处理逻辑
        // eslint-disable-next-line no-case-declarations
        const { type } = await new CoreBuildToolInquirer().interactionsHandler();
        answer.buildToolType = type;
        await new CoreLiteDownloader().syncDownload(answer);
        break;
      default:
        // 自定义版本处理逻辑
        // 3-1.依据基本配置载下配置文件路由模板
        const contentAnswer = await new CoreSelector().interactionsSelect(answer);
       
        // 选择开发语言 javascript/typescript 【暂未发布】
        // const languageAnswer = await new CoreJsTransformInquirer().interactionsHandler();
        // const finalAnswer = { ...contentAnswer, ...languageAnswer };

        // 3-2.构建配置保存
        await new CoreGitDownloader().syncDownload(answer, contentAnswer);
        break;
    }
  }

  /**
   * 读写权限检测
   *
   * @private
   * @param {string} path
   * @returns {Promise<boolean>}
   *
   * @memberOf Creator
   */
  private async checkReadAndWriteRights(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.log("%s doesn't exist", path);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default Creator;
