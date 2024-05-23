import chalk from 'chalk';
import Creator from './core/CoreIndex';
import { program } from 'commander';
import pkg from '../package.json';

program.version(chalk.green(`v${pkg.version}`), '-v, --version');

/**
 * 初始化项目
 * @description '--d', '--description', '项目描述'
 * @description '--type', '--type', '代码版本 vue2 | vue3 | react | miniProgram | mobileVue'
 * @description '--temp', '--template', '项目模版类型 lite | all'
 * @description '--bt', '--buildToolType', '构建工具类型 vite | webpack'
 */
program
	.command('init [templateName]')
	.alias('i')
	.description('欢迎使用 TDesign-Starter')
	.option('-d,--description <description>', 'description of a project', 'Base on tdesign-starter-cli')
	.option('-type,--type <type>', 'Code version vue2 | vue3 | react | miniProgram | mobileVue ', 'vue2')
	.option('-temp,--template <template>', 'Project template type: lite | all', 'lite')
	.option('-bt,--buildToolType <buildToolType>', 'The construction tool for lite: vite | webpack', 'vite')
	.action((name, options, command) => {
		new Creator(name, options, command);
	});

// 解析参数
program.parse(process.argv);
