import fs from 'fs';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { SupportedTemplate, templates } from './CoreTemplate';
import { CoreOptionsFilterForVue2, IOptionsFilter } from './core-options/CoreOptionsFilterForVue2';
import { CoreOptionsFilterForVue3 } from './core-options/CoreOptionsFilterForVue3';
import rimraf from 'rimraf';

export class CoreGitDownloader {
  /**
   * 下载工程目录，依据配置选择是否需要筛选不需要目录
   * @returns 命令行数组
   */
  public async syncDownload(options: { type: SupportedTemplate; name: string; description: string }, finalOptions: any) {
    console.log();
    console.log(chalk.green('👉  开始构建，请稍侯...'));
    console.log();
    const spinner = ora('正在构建模板...').start();
    const { downloadUrl, url } = templates[`${options.type || 'vue2'}`];

    // 清除测试目录
    await this.clearTestFolder();

    // 执行下载
    await this.executeDownload(spinner, downloadUrl, url, options);

    // 写入后依据用户选择内容，清除部份内容
    let optionsFilter!: IOptionsFilter;
    switch (options.type) {
      case 'vue2':
        // 选择包括模块 VUE2：
        // eslint-disable-next-line no-case-declarations
        optionsFilter = new CoreOptionsFilterForVue2();
        if (finalOptions.selectSource !== 'all') {
          // 选择包括模块：排除不用内容
          await optionsFilter.excludeModules(options, finalOptions);

          // 生成特定路由配置
          await optionsFilter.generateModulesRoute(options, finalOptions);
        }

        break;

      case 'vue3':
        // 选择包括模块 VUE3：
        // eslint-disable-next-line no-case-declarations
        optionsFilter = new CoreOptionsFilterForVue3();
        if (finalOptions.selectSource !== 'all') {
          // finalOptions.selectTypes;
          // 选择包括模块：排除不用内容
          await optionsFilter.excludeModules(options, finalOptions);

          // 生成特定路由配置
          await optionsFilter.generateModulesRoute(options, finalOptions);
        }

        break;
      // TODO: react
      // case other...
      default:
        break;
    }

    if (optionsFilter) {
      // 增加选择范围
      // 去除生成目录内容 .github  .husky .vscode
      // 添加原来的内容给下载目录选择
      await optionsFilter.clearUnusedDirectories(options, finalOptions);
    }

    // 执行成功相关操作
    this.executeBuildSuccess(spinner, options);
  }

  /**
   * 清除测试目录，如果有
   *
   *
   * @memberOf CoreGitDownloader
   */
  public async clearTestFolder() {
    try {
      const dir = path.join(`${process.env.PWD}`, 'test');
      await rimraf.sync(dir);
    } catch (error) {
      console.log(`deleted! error`, error);
    }
  }

  /**
   * 执行成功相关操作
   *
   * @private
   * @param {*} spinner
   * @param {*} options
   *
   * @memberOf CoreGitDownloader
   */
  private executeBuildSuccess(spinner: any, options: any) {
    console.log();
    spinner.succeed(chalk.green('构建成功！'));
    const packagePath = path.join(options.name, 'package.json');
    try {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      packageContent.name = options.name;
      packageContent.description = options.description;

      // 去掉预装husky,因为不存在.git
      packageContent.scripts.prepare = "node -e \"if(require('fs').existsSync('.git')){process.exit(1)}\" || is-ci || husky install";

      // 写入配置
      fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2), {
        encoding: 'utf8'
      });
    } catch (error) {
      console.log('write file error==', error);
    }

    console.log();
    console.log(chalk.green('👏 初始化项目完成！👏'));
    console.log();
    console.log(chalk.blue('命令提示：'));
    console.log(chalk.blue(`  # 进入项目`));
    console.log(chalk.blue(`  $ cd ./${options.name}`));
    console.log(chalk.blue(`  # 安装依赖`));
    console.log(chalk.blue(`  $ npm install`));
    console.log(chalk.blue(`  # 运行`));
    console.log(chalk.blue(`  $ npm run dev`));
    console.log();
  }

  /**
   * 执行下载
   *
   * @private
   * @param {{ type: SupportedTemplate, name: string, description: string }} options
   * @param {*} finalOptions
   *
   * @memberOf CoreGitDownloader
   */
  private executeDownload(spinner: any, downloadUrl: string, url: string, options: { type: SupportedTemplate; name: string; description: string }) {
    return new Promise((resolve) => {
      download(downloadUrl, options.name, { clone: false }, async (err: Error) => {
        if (err) {
          spinner.fail(chalk.red('❗错误：下载模板失败'));
          console.log(chalk.red('❗错误信息：'), chalk.red(err));
          console.log(chalk.red(`❗请尝试执行：git clone ${url} 使用`));
          console.log('executeDownload error ==', err);

          process.exit();
          // resolve(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
