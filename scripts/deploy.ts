import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import { cp } from 'fs/promises';
import path from 'path';

/** 异步 exec 命令 */
const execAsync = promisify(exec);
/** 异步 cp 命令 */
const cpAsync = promisify(cp);

/**
 * 匹配文件 vite.config.js/ts  farm.config.js/ts
 * @param root 根目录
 * @param reg 匹配规则
 * @param isPath 是否返回路径还是文件名
 */
const filesReg = (root: string, reg: RegExp, isPath = false) => {
  // 获取根目录下的文件夹名称
  const dirs = fs.readdirSync(root, { withFileTypes: true })
    .map(dirent => dirent.name);

  if (!isPath) {
    return dirs.filter(dir => reg.test(dir));
  }
  return dirs.filter(dir => reg.test(dir)).map(dir => path.join(root, dir));
}

/**
 * 处理重写文件(添加path) vite.config.js/ts farm.config.js/ts 
 * @param configReg 匹配规则
 * @param reg 匹配规则
 * @param getNewConfigFile 获取新的config.* 文件
 */
const configFilesReg = async (configReg: RegExp, reg: RegExp,
  getNewConfigFile: (readConfigFile: string, template: string) => string) => {
  const cwd = process.cwd();
  const templates = filesReg(cwd, configReg);

  await Promise.all(templates.map(async (template) => {
    // 重写config.* 文件
    const configFilePath = filesReg(path.join(cwd, template), reg, true)?.[0];
    const readConfigFile = fs.readFileSync(configFilePath, 'utf-8');
    const newConfigFile = getNewConfigFile(readConfigFile, template);
    fs.writeFileSync(configFilePath, newConfigFile);

    await execAsync(`pnpm install && pnpm run build`, { cwd: path.join(process.cwd(), template) });

    // 拷贝dist文件夹到根目录并且重命名
    const distFilePath = path.join(process.cwd(), template, 'dist');
    const newDistFilePath = path.join(process.cwd(), 'dist', template);
    await cpAsync(distFilePath, newDistFilePath, { recursive: true });
  }));
}

const initTemplates = async (templates: { name: string, description: string, type: string, buildToolType: string }[]) => {
  for (const template of templates) {
    await execAsync(`pnpm run dev init ${template.name} --description ${template.description} --type ${template.type} --template lite --buildToolType ${template.buildToolType}`);
  }
}

const preview = async () => {
  try {
    const templates = [
      { name: 'template-vite-vue3', description: '这是一个vite构建的vue3项目', type: 'vue3', buildToolType: 'vite' },
      { name: 'template-vite-vue2', description: '这是一个vite构建的vue2项目', type: 'vue2', buildToolType: 'vite' },
      { name: 'template-vite-react', description: '这是一个vite构建的react项目', type: 'react', buildToolType: 'vite' },
      { name: 'template-farm-vue3', description: '这是一个farm构建的vue3项目', type: 'vue3', buildToolType: 'farm' },
      { name: 'template-farm-vue2', description: '这是一个farm构建的vue2项目', type: 'vue2', buildToolType: 'farm' },
      { name: 'template-farm-react', description: '这是一个farm构建的react项目', type: 'react', buildToolType: 'farm' },
      // { name: 'template-webpack-vue3', description: '这是一个webpack构建的vue3项目', type: 'vue3', buildToolType: 'webpack' },
      // { name: 'template-webpack-vue2', description: '这是一个webpack构建的vue2项目', type: 'vue2', buildToolType: 'webpack' },
      // { name: 'template-webpack-react', description: '这是一个webpack构建的react项目', type: 'react', buildToolType: 'webpack' },
    ];

    await initTemplates(templates);

    // vite 模版
    const generateViteConfig = (readConfigFile: string, template: string) =>
      readConfigFile.replace('defineConfig({', `defineConfig({\n base: '/${template}',`);

    await configFilesReg(/^template-vite/, /^vite.config.*/, generateViteConfig);

    // farm 模版
    const generateFarmConfig = (readConfigFile: string, template: string) =>
      readConfigFile.replace('defineConfig({', `defineConfig({ \n compilation: {\n output: {\n publicPath: '/${template}',\n },\n },\n`);

    await configFilesReg(/^template-farm/, /^farm.config.*/, generateFarmConfig);

    // webpack 模版
    // todo

  } catch (e) {
    console.error(e);
  }
};

preview();