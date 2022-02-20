import chalk from 'chalk';
import clear from 'clear';
import ora from 'ora';
import figlet from 'figlet';
import { CoreSelector } from './CoreSelector';
import { CoreInquier } from './CoreInquirer';
import { CoreGitDownloader } from './CoreGitDownloader';
import { templates } from './CoreTemplate';
import fs from 'fs';

/**
 * Tdesign starter CLI
 *
 * @class TdesignStarterCLI
 */
export class TdesignStarterCLI {

  public spinner: any;

	constructor() {
    clear();
		console.log('*****************************');
		console.log(chalk.green(figlet.textSync('TDesign Starter', { horizontalLayout: 'full' })));
		console.log('*****************************');
		console.log();

		this.spinner = ora('👉 检查构建环境...').start();

	}

  /**
   * 初始化
   *
   * @returns
   *
   * @memberOf TdesignStarterCLI
   */
  public async init(): Promise<TdesignStarterCLI> {
    return new Promise((resolve: any, reject: any): any => {
      this.checkReadAndWriteRights(process.env.PWD || '').then((canBeWrite) => {
        if (!canBeWrite) {
          console.log(chalk.red('❗错误：请检测当前用户是否有足够的目录读写权限!'));
          process.exit();
        } else {
           this.spinner.succeed(chalk.green('构建环境正常！'));
           console.log();
           resolve(this);
        }
      })
    })
  }

  /**
   * 前置条件满足，进入子程序(=======选择全部模式=======)
   *
   *
   * @memberOf Creator
   */
	public async initBySelect(selectValue: string) {
    const templateSource: any = templates;
    const { routerData }: any = templateSource[`${selectValue || 'vue2'}`];

    // 1.基本配置数据获取
		const answer: any = { type: selectValue, name: routerData.description, description: `A ${routerData.description} project.` };

    // 2.依据基本配置载下配置文件路由模板
    const finalAnswer = {selectSource: 'all'};

    // 3.构建配置保存
		await new CoreGitDownloader().syncDownload(answer, finalAnswer);
	}

  /**
   * 前置条件满足，进入子程序(=======默认模式+让用户选部份内容模式=======)
   *
   *
   * @memberOf Creator
   */
	public async initByDefault() {
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
