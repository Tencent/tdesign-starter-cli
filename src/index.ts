import chalk from 'chalk';
import Creator from './core/CoreIndex';
import { program } from 'commander';
import pkg from '../package.json';
import path from 'path';
import { fileURLToPath } from 'url';
import { CoreI18nHandler, analyzeProjectType, askForTargetPath } from './core/core-i18n/CoreI18nHandler';

// ES Module 中获取 CLI 项目根目录
const CLI_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * 解析路径为绝对路径
 * @param inputPath 输入路径
 * @returns 绝对路径
 */
function resolveAbsolutePath(inputPath: string): string {
	return path.isAbsolute(inputPath) ? inputPath : path.resolve(CLI_ROOT, inputPath);
}

program.version(chalk.green(`v${pkg.version}`), '-v, --version');

/**
 * 初始化项目命令
 */
program
	.command('init [templateName]')
	.alias('i')
	.description('欢迎使用 TDesign-Starter')
	.option('-d,--description <description>', '项目描述', 'Base on tdesign-starter-cli')
	.option('-type,--type <type>', '代码版本: vue2 | vue3 | react | miniProgram | mobileVue', 'vue2')
	.option('-temp,--template <template>', '项目模板类型: lite | all', 'lite')
	.option('-bt,--buildToolType <buildToolType>', '构建工具类型: vite | webpack', 'vite')
	.action((name, options, command) => {
		new Creator(name, options, command);
	});

/**
 * i18n 本地化处理命令
 */
program
	.command('i18n')
	.description('将项目中的 i18n 调用替换为本地化字符串')
	.option('-t,--target <targetPath>', '目标项目路径')
	.action(async (options: { target?: string }) => {
		// 确定目标项目路径
		const targetPath = resolveAbsolutePath(options.target ?? await askForTargetPath());
		console.log(chalk.gray(`🔍 目标项目路径: ${targetPath}`));

		// 分析项目类型
		const projectType = await analyzeProjectType(targetPath);
		if (projectType === 'unknown') {
			console.log(chalk.red('❌ 无法识别项目类型'));
			console.log(chalk.gray('   当前仅支持 Vue3 项目'));
			console.log(chalk.gray(`   请检查路径是否存在: ${targetPath}`));
			return;
		}
		console.log(chalk.green(`✅ 检测到项目类型: ${projectType}`));

		// 执行本地化
		await new CoreI18nHandler({ targetPath, projectType }).execute(projectType);
	});

program.parse(process.argv);
