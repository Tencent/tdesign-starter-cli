import chalk from 'chalk';
import clear from 'clear';
import ora from 'ora';
import figlet from 'figlet';
import { directoryExists } from '../utils/UtilsIndex';
import { CoreSelector } from './CoreSelector';
import { CoreInquier } from './CoreInquirer';
import { CoreGitDownloader } from './CoreGitDownloader';
import fs from 'fs';

class Creator {
	constructor() {
    clear();
		console.log('*****************************');
		console.log(chalk.green(figlet.textSync('TDesign Starter', { horizontalLayout: 'full' })));
		console.log('*****************************');
		console.log();
		// console.log(process.env);
		// console.log(chalk.blue('❗或者可以通过以下其它途径下载本脚手架工程：'));
		// console.log(chalk.blue('❗1.直接前往：https://github.com/tencent/tdesign-vue-starter 在线下载。'));
		// console.log(chalk.blue('❗2.使用 git clone git@github.com:Tencent/tdesign-vue-starter.git'));
		// console.log(chalk.blue('❗3.目前我们最新代码的稳定分支为develop'));
		// console.log();

		const spinner = ora('👉 检查构建环境...').start();

		// 判断是否存在.git文件
    // let isSkip = false;
    // if (process.argv.length === 4) {
    //   if (process.argv[3] === 's') {
    //     isSkip = true;
    //   }
    // }
		// if (!isSkip && directoryExists('.git')) {
		// 	console.log(chalk.red('❗错误：当前目录已经存在有本地仓库，请重新选择其它空目录!'));
		// 	// log.error('已经存在一个本地仓库!');
		// 	process.exit();
		// }
   this.checkReadAndWriteRights(process.env.PWD || '').then((canBeWrite) => {
     if (!canBeWrite) {
       console.log(chalk.red('❗错误：请检测当前用户是否有充足的目录读写权限!'));
       process.exit();
     } else {
        spinner.succeed(chalk.green('构建环境正常！'));
        console.log();
        this.init();
     }
   })
	}

  /**
   * 前置条件满足，进入子程序
   *
   *
   * @memberOf Creator
   */
	public async init() {
    // 1.基本配置数据获取
		const answer = await new CoreInquier().interactionsHandler();

    // 2.依据基本配置载下配置文件路由模板
    const finalAnswer = await new CoreSelector().interactonsSelect(answer);

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
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
          if (err) {
              console.log("%s doesn't exist", path);
              resolve(false);
          } else {
              // console.log('can read/write %s', path);
              resolve(true);
          }
      });
    })
  }
}

export default Creator;
