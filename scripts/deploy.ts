import { promisify } from 'util';
import { exec } from 'child_process';
import fs, { mkdirSync } from 'fs';
import { cp } from 'fs/promises';
import path from 'path';

/** 异步 exec 命令 */
const execAsync = promisify(exec);
/** 异步 cp 命令 */
const cpAsync = promisify(cp);

/**
 * 匹配文件路径 vite.config.js/ts  farm.config.js/ts
 * @param root 根目录
 * @param reg 匹配规则
 * @return 返回路径
 */
const filePathReg = (root: string, reg: RegExp) => {
  // 获取根目录下的文件夹名称
  const dirs = fs.readdirSync(root, { withFileTypes: true })
    .map(dirent => dirent.name);
  return dirs.filter(dir => reg.test(dir)).map(dir => path.join(root, dir));
}
/**
 * 匹配文件名称 vite.config.js/ts  farm.config.js/ts
 * @param root 根目录
 * @param reg 匹配规则
 * @return 返回文件名
 */
const fileNameReg = (root: string, reg: RegExp, isPath = false) => {
  // 获取根目录下的文件夹名称
  const dirs = fs.readdirSync(root, { withFileTypes: true })
    .map(dirent => dirent.name);
  return dirs.filter(dir => reg.test(dir));
}

type GetNewConfigFileFn = (readConfigFile: string, template: string) => string;

/**
 * 处理重写文件(添加path) vite.config.js/ts farm.config.js/ts 
 * @param configReg 匹配规则
 * @param reg 匹配规则
 * @param getNewConfigFile 获取新的config.* 文件
 */
const configFilesReg = async (configReg: RegExp, reg: RegExp, getNewConfigFile: GetNewConfigFileFn) => {
  const cwd = process.cwd();
  const templates = fileNameReg(cwd, configReg);

  templates.forEach(async (template) => {
    // 特殊处理 template-webpack-react 使用craco重写 create-react-app 配置
    if (template === 'template-webpack-react') {
      const cracoConfig = `
         const path = require('path');
         const fs = require('fs');

         const appDirectory = fs.realpathSync(process.cwd());
         const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
         module.exports = {
           webpack: {
             configure: (webpackConfig, { env, paths }) => {
             paths.appBuild = webpackConfig.output.path = path.resolve(__dirname, 'dist');
             webpackConfig.output.publicPath = resolveApp('/template-webpack-react');
              return webpackConfig;
             },
           },
         };
          `

      const cracoConfigPath = path.join(cwd, template, 'craco.config.js');
      fs.writeFileSync(cracoConfigPath, cracoConfig);
      await execAsync(` pnpm i -D @types/node && pnpm i -D @craco/craco`, { cwd: path.join(process.cwd(), template) });
      const packageJsonPath = path.join(cwd, template, 'package.json');
      fs.writeFileSync(packageJsonPath, fs.readFileSync(packageJsonPath, 'utf-8').replace('react-scripts build', 'craco build'));
      // 处理 create-react-app需要 .eslintrc.cjs的问题 删除 .eslintrc.js
      const eslintrcPath = path.join(cwd, '.eslintrc.js');
      if (fs.existsSync(eslintrcPath)) {
        fs.unlinkSync(eslintrcPath);
      }
    }

    // 匹配config.* 文件
    const configFilePath = filePathReg(path.join(cwd, template), reg)?.[0];
    if (configFilePath) {
      // 重写config.* 文件
      const readConfigFile = fs.readFileSync(configFilePath, 'utf-8');
      const newConfigFile = getNewConfigFile(readConfigFile, template);
      fs.writeFileSync(configFilePath, newConfigFile);
    }

    await execAsync(`pnpm install && pnpm run build`, { cwd: path.join(process.cwd(), template) });

    // 拷贝dist文件夹到根目录并且重命名
    const distFilePath = path.join(process.cwd(), template, 'dist');
    const newDistFilePath = path.join(process.cwd(), 'dist', template);
    await cpAsync(distFilePath, newDistFilePath, { recursive: true });
  });
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
      { name: 'template-webpack-vue3', description: '这是一个webpack构建的vue3项目', type: 'vue3', buildToolType: 'webpack' },
      { name: 'template-webpack-vue2', description: '这是一个webpack构建的vue2项目', type: 'vue2', buildToolType: 'webpack' },
      { name: 'template-webpack-react', description: '这是一个webpack构建的react项目', type: 'react', buildToolType: 'webpack' },
    ];

    await initTemplates(templates);

    // vite 模版重写
    const generateViteConfig = (readConfigFile: string, template: string) => {
      const replacementRules = [
        {
          mate: 'defineConfig({',
          sub: `defineConfig({\n base: '/${template}',`
        },
        {
          mate: 'export default {',
          sub: `export default {\n base: '/${template}',`
        }
      ]

      replacementRules.map(replacementRule => {
        if (readConfigFile.includes(replacementRule.mate)) {
          readConfigFile = readConfigFile.replace(replacementRule.mate, replacementRule.sub);
        }
      });
      return readConfigFile;
    }

    // farm 模版重写
    const generateFarmConfig = (readConfigFile: string, template: string) => {
      const replacementRules = [
        {
          mate: 'defineConfig({',
          sub: `defineConfig({ \n compilation: {\n output: {\n publicPath: '/${template}',\n },\n },\n`
        }
      ]

      replacementRules.map(replacementRule => {
        if (readConfigFile.includes(replacementRule.mate)) {
          readConfigFile = readConfigFile.replace(replacementRule.mate, replacementRule.sub);
        }
      });
      return readConfigFile;
    }

    // webpack 模版重写
    const generateWebpackConfig = (readConfigFile: string, template: string) => {
      const replacementRules = [
        {
          mate: 'module.exports = {',
          sub: `module.exports = {\n publicPath: '/${template}',\n`
        }
      ]

      replacementRules.map(replacementRule => {
        if (readConfigFile.includes(replacementRule.mate)) {
          readConfigFile = readConfigFile.replace(replacementRule.mate, replacementRule.sub);
        }
      });
      return readConfigFile;
    }

    await configFilesReg(/^template-vite/, /^vite.config.*/, generateViteConfig);
    await configFilesReg(/^template-farm/, /^farm.config.*/, generateFarmConfig);
    await configFilesReg(/^template-webpack/, /^vue.config.*/, generateWebpackConfig);


  } catch (e) {
    console.error(e);
  }
};

preview().catch(e => console.error(e));