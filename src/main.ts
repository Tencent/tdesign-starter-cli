import chalk from 'chalk';
import Creater from './core/CoreIndex';
import { program } from 'commander';
import pkg from '../package.json';

program.version(chalk.green(`v${pkg.version}`), '-v, --version');

program
	.command('init')
	.alias('i')
	.description('欢迎使用 TDesign-Vue2-Pro')
	.action(() => {
		const builder = new Creater();
		builder.init();
	});

// 解析参数
program.parse(process.argv);
