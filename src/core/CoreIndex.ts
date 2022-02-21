import chalk from 'chalk';
import clear from 'clear';
import ora from 'ora';
import figlet from 'figlet';
import { CoreSelector } from './CoreSelector';
import { CoreInquirer } from './CoreInquirer';
import { CoreGitDownloader } from './CoreGitDownloader';
import fs from 'fs';

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
    // this.checkReadAndWriteRights(process.env.PWD || '').then((canBeWrite) => {
    //   if (!canBeWrite) {
    //     console.log(chalk.red('❗错误：请检测当前用户是否有充足的目录读写权限!'));
    //     process.exit();
    //   } else {
    //     spinner.succeed(chalk.green('构建环境正常！'));
    //     console.log();
    //     this.init();
    //   }
    // });
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

    // 2.依据基本配置载下配置文件路由模板
    const finalAnswer = await new CoreSelector().interactionsSelect(answer);

    // 3.构建配置保存
    await new CoreGitDownloader().syncDownload(answer, finalAnswer);
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
