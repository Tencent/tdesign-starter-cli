import fs from 'fs';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { SupportedTemplate, templates } from './CoreTemplate';
export class CoreGitDownloader {
  /**
   * 下载工程目录，依据配置选择是否需要筛选不需要目录
   * @returns 命令行数组
   */
  public syncDownload(options: { type: SupportedTemplate, name: string, description: string }, finalOptions: any) {
    console.log(finalOptions);
    console.log();
    console.log(chalk.green('👉  开始构建，请稍侯.'));
    console.log();
    const spinner = ora('正在构建模板...').start();
    const { downloadUrl, url } = templates[`${options.type || 'vue2'}`];

    download(downloadUrl, options.name, { clone: false }, (err: Error) => {
      if (err) {
        spinner.fail(chalk.red('❗错误：下载模板失败'));
        console.log(chalk.red('❗错误信息：'), chalk.red(err));
        console.log(chalk.red(`❗请尝试执行：git clone ${url} 使用`));

        process.exit();
      }

      // TODO: 写入后依据用户选择内容，清除部份内容
      // 选择包括模块：
      if (finalOptions.selectSource !== 'all') {
        finalOptions.seletTypes; // 选择包括模块：
        // 排除不用内容
      }

      // 增加选择范围
      // 去除生成目录内容 .github  .husky .vscode
      // 添加原来的内容给下载目录选择

      console.log();
      spinner.succeed(chalk.green('构建成功！'));
      const packagePath = path.join(options.name, 'package.json');
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      packageContent.name = options.name;
      packageContent.description = options.description;
      fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2), {
        encoding: 'utf8'
      });

      console.log();
      console.log(chalk.green('👏  初始化项目完成！👏'));
      console.log();
      console.log(chalk.blue('命令提示：'));
      console.log(chalk.blue(`  # 进入项目`));
      console.log(chalk.blue(`  $ cd ./${options.name}`));
      console.log(chalk.blue(`  # 安装依赖`));
      console.log(chalk.blue(`  $ npm install`));
      console.log(chalk.blue(`  # 运行`));
      console.log(chalk.blue(`  $ npm run dev`));
      console.log();
    });
  }
}
