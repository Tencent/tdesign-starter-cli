import { CoreGitDownloader } from "../CoreGitDownloader";
import { SupportedTemplate } from "../CoreTemplate";

/**
 * 极简板本生成器
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
   public async syncDownload(options: { type: SupportedTemplate; name: string; description: string }, finalOptions: any = {}) {
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
      case 'react':
        // 选择包括模块 React：
        // eslint-disable-next-line no-case-declarations
        optionsFilter = new CoreOptionsFilterForReact();
        if (finalOptions.selectSource !== 'all') {
          // finalOptions.selectTypes;
          // 选择包括模块：排除不用内容
          await optionsFilter.excludeModules(options, finalOptions);

          // 生成特定路由配置
          await optionsFilter.generateModulesRoute(options, finalOptions);
        }

        break;
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
}
