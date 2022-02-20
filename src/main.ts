import chalk from 'chalk';
import {TdesignStarterCLI} from './core/CoreIndex';
import { program } from 'commander';
import pkg from '../package.json';

program.version(chalk.green(`v${pkg.version}`), '-v, --version');

program
	.command('init')
	.alias('i')
  .arguments('[template]')
	.description('欢迎使用 TDesign-Starter')
	.action(onProgramCallBack);

  // td-starter init vue2 -y || td-starter init vue -y 一键创建vue2 的模板
  // td-starter init vue3 -y || td-starter init vue-next -y 一键创建vue3 的模板
  // td-starter init react -y 一键创建react 的模板

// 解析参数
program.parse(process.argv);

/**
 * PROGRAMM callback
 *
 * @param {*} template
 * @param {*} options
 * @param {*} command
 */
async function onProgramCallBack(template: any, options: any, command: any) {
  // console.log("template==", template);
  const creator: any = new TdesignStarterCLI();
  const initResult = await creator.init();
  console.log('initResult==', initResult);

  switch(template) {
    case 'vue':
    case 'vue2':
      // 生成VUE默认模板
      // eslint-disable-next-line no-case-declarations
      await creator.initBySelect(template);
      break;
      // 生成VUE3默认模板
    case 'vue3':
       // eslint-disable-next-line no-case-declarations
       await creator.initBySelect(template);
      break;
      // 生成REACT模板
    // case 'react':
    //   await initResult.initBySelect(template);
    //   break;
    default:
      // 选择分叉逻辑
      await creator.initByDefatul();
      break;
  }
}
