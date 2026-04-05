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
import { CreatorOptions, SupportedTemplateSize } from '../types/type';
import { CoreLiteDownloader } from './core-lite/CoreLiteDownloader';

class Creator {
  constructor(name: string, options: Omit<CreatorOptions, 'name'>, _command: any) {
    clear();
    console.log('*****************************');
    console.log(chalk.green(figlet.textSync('TDesign Starter', { horizontalLayout: 'full' })));
    console.log('*****************************');
    console.log();

    const spinner = ora('👉 检查构建环境...').start();

    // 如果有name参数，直接下载模板
    if (name) {
      const answer: CreatorOptions = {
        ...options,
        name
      };
      let isValid = true;

      outerLoop: for (const key of Object.keys(options)) {
        switch (key) {
          case 'description':
            break;
          case 'type':
            if (!['vue2', 'vue3', 'react', 'miniProgram', 'mobileVue'].includes(options['type'])) {
              spinner.fail(chalk.red('type 参数错误，请输入vue2 | vue3 | react | miniProgram | mobileVue'));
              isValid = false;
              break outerLoop;
            }
            break;
          case 'template':
            if (!['lite', 'all'].includes(options['template'])) {
              spinner.fail(chalk.red('template 参数错误，请输入lite | all'));
              isValid = false;
              break outerLoop;
            }
            break;
          case 'buildToolType':
            if (!['vite', 'webpack', 'farm'].includes(options['buildToolType'])) {
              spinner.fail(chalk.red('buildToolType 参数错误，请输入vite | webpack | farm'));
              isValid = false;
              break outerLoop;
            }
            break;
          default:
            ora().fail(chalk.red('命令无效'));
            isValid = false;
            break outerLoop;
        }
      }
      if (!isValid) {
        return;
      }

      spinner.succeed(chalk.green('构建环境正常！'));
      console.log();

      if (['miniProgram', 'mobileVue'].includes(options?.type)) {
        new CoreGitDownloader().syncDownload(answer);
        return;
      }

      switch (answer.template) {
        case 'lite':
          new CoreLiteDownloader().syncDownload(answer);
          break;
        default:
          new CoreSelector().interactionsSelect(answer).then((contentAnswer) => {
            new CoreGitDownloader().syncDownload(answer, contentAnswer);
          });
      }
      return;
    }

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

    if (['miniProgram', 'mobileVue'].includes(answer?.type)) {
      await new CoreGitDownloader().syncDownload(answer);
      return;
    }

    // 2.询问生成简化版还是自定义版本
    const listOptions: { template: SupportedTemplateSize; name: string; description?: string } = await new CoreLiteInquirer().interactionsHandler();

    // 3.执行下载生成动作
    switch (listOptions.template) {
      case 'lite':
        // 极简版本处理逻辑
        // eslint-disable-next-line no-case-declarations
        const { buildToolType } = await new CoreBuildToolInquirer().interactionsHandler();
        const typed_Answer = answer as Pick<CreatorOptions, 'name' | 'description' | 'type' | 'buildToolType'>;
        typed_Answer.buildToolType = buildToolType;
        await new CoreLiteDownloader().syncDownload(typed_Answer);
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
