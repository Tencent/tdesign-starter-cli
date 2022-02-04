import fs from 'fs';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';


type SupportedTemplate = 'vue2' | 'vue3';
/**
 * 模板地址
 */
const templates: Record<SupportedTemplate, { url: string, description: string, downloadUrl: string }> = {
  vue2: {
    url: 'https://github.com/Tencent/tdesign-vue-starter.git',
    description: 'TDesign Vue2 Starter',
    downloadUrl: 'github.com.cnpmjs.org:Tencent/tdesign-vue-starter#main'
  },
  vue3: {
    url: 'https://github.com/Tencent/tdesign-vue-next-starter.git',
    description: 'TDesign Vue3 Starter',
    downloadUrl: 'github.com.cnpmjs.org:Tencent/tdesign-vue-next-starter#main'
  }
};

/**
 * 拉取代码
 * @returns 命令行数组
 */
export function getTemplate(options: { type: SupportedTemplate, name: string, description: string }) {
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
