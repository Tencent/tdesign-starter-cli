import { interactionsHandler } from './CoreInquirer';
import { getTemplate } from './CoreGitDownloader';
import chalk from 'chalk';
import clear from 'clear';
import ora from 'ora';
import figlet from 'figlet';
import { directoryExists } from '../utils/UtilsIndex';
class Creater {
	constructor() {
		clear();
		console.log('*****************************');
		console.log(chalk.green(figlet.textSync('TDesign Starter', { horizontalLayout: 'full' })));
		console.log('*****************************');
		console.log();
		console.log();
    // console.log(chalk.blue('❗或者可以通过以下其它途径下载本脚手架工程：'));
    // console.log(chalk.blue('❗1.直接前往：https://github.com/tencent/tdesign-vue-starter 在线下载。'));
    // console.log(chalk.blue('❗2.使用 git clone git@github.com:Tencent/tdesign-vue-starter.git'));
    // console.log(chalk.blue('❗3.目前我们最新代码的稳定分支为develop'));
    // console.log();

		const spinner = ora('👉 检查构建环境...').start();

		// 判断是否存在.git文件
		if (directoryExists('.git')) {
			console.log(chalk.red('❗错误：当前目录已经存在有本地仓库，请重新选择其它空目录!'));
			// log.error('已经存在一个本地仓库!');
			process.exit();
		}

		spinner.succeed(chalk.green('构建环境正常！'));
		console.log();
	}

	async init() {
		const answer = await interactionsHandler();
		console.log();
		console.log(chalk.green('👉  开始构建，请稍侯.'));
		await getTemplate(answer);
	}
}

export default Creater;
