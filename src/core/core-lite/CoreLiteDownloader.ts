import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { CoreGitDownloader } from '../CoreGitDownloader';
import fse from 'fs-extra';
import { pathResolve } from '../../utils/UtilsFile';
import { CreatorOptions } from '../../types/type';

/**
 * 极简版本生成器
 *
 * @export
 * @class CoreLiteDownloader
 * @extends {CoreGitDownloader}
 */
export class CoreLiteDownloader extends CoreGitDownloader {
  /**
   * 下载工程目录，依据配置选择是否需要筛选不需要目录
   * @returns 命令行数组
   */
  public async syncDownload(options: Pick<CreatorOptions, 'name' | 'description' | 'buildToolType' | 'type'>) {
    console.log();
    console.log(chalk.green('👉  开始构建，请稍侯...'));
    console.log();
    const spinner = ora('正在构建模板...').start();
    console.log();

    // 清除测试目录
    await this.clearTestFolder();

    await this.copyTemplate(options);

    // 执行成功相关操作
    this.executeBuildSuccess(spinner, options);
  }

  /**
   * 复制模板
   *
   * @protected
   * @param { Pick<CreatorOptions, 'name' | 'description' | 'buildToolType' | 'type'> } options
   *
   * @memberOf CoreLiteDownloader
   */
  protected async copyTemplate(options: Pick<CreatorOptions, 'name' | 'description' | 'buildToolType' | 'type'>): Promise<any> {
    let copyFolderName = 'vue-lite';
    const destDir = path.resolve(process.cwd(), options.name);
    switch (options.type) {
      case 'vue2':
        copyFolderName = 'vue-lite';
        break;
      case 'vue3':
        copyFolderName = 'vue-next-lite';
        break;
      case 'react':
        copyFolderName = 'react-lite';
        break;
    }
    const srcDir = pathResolve(path.posix.join('templates', options.buildToolType, copyFolderName));
    try {
      await fse.copy(srcDir, destDir);
      console.log();
      console.log(chalk.green('👉  生成代码完毕...'));
    } catch (err) {
      console.error(err);
    }
  }
}
