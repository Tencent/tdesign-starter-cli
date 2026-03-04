import { promisify } from 'util';
import { exec } from 'child_process';
import fs, { mkdirSync } from 'fs';
import path from 'path';
import fse from 'fs-extra';

/** 异步 exec 命令 */
const execAsync = promisify(exec);

/** 模板配置类型 */
interface TemplateConfig {
  name: string;
  description: string;
  type: string;
  buildToolType: string;
}

/** 获取目录下的文件夹列表
 * @param root 根目录
 * @param reg 匹配规则
 * @param fullPath 是否返回完整路径
 * @return 返回文件夹名或路径数组
 */
const getMatchedDirs = (root: string, reg: RegExp, fullPath = false): string[] => {
  const dirs = fs.readdirSync(root, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(dirName => reg.test(dirName));
  return fullPath ? dirs.map(dir => path.join(root, dir)) : dirs;
}

type GetNewConfigFileFn = (readConfigFile: string, template: string) => string;

/** 模板类型配置 */
const TEMPLATE_CONFIGS: { vite: RegExp; farm: RegExp; webpack: RegExp } = {
  vite: /^template-vite/,
  farm: /^template-farm/,
  webpack: /^template-webpack/,
};

/** 工具函数：统一替换配置 */
const applyReplacementRules = (content: string, rules: { mate: string; sub: string }[]): string => {
  let result = content;
  for (const rule of rules) {
    if (result.includes(rule.mate)) {
      result = result.replace(rule.mate, rule.sub);
    }
  }
  return result;
};

/** 处理重写文件(添加path) vite.config.js/ts farm.config.js/ts
 * @param configReg 匹配规则
 * @param reg 匹配规则
 * @param getNewConfigFile 获取新的config.* 文件
 */
const configFilesReg = async (configReg: RegExp, reg: RegExp, getNewConfigFile: GetNewConfigFileFn) => {
  const cwd = process.cwd();
  const templates = getMatchedDirs(cwd, configReg);
  console.log(`找到 ${templates.length} 个模板: ${templates.join(', ')}`);

  for (const template of templates) {
    console.log(`\n========== 开始处理模板: ${template} ==========`);

    // 特殊处理 template-webpack-react 使用 webpack 配置
    if (template === 'template-webpack-react') {
      const webpackConfigPath = path.join(cwd, template, 'webpack.config.js');
      if (fs.existsSync(webpackConfigPath)) {
        let webpackConfig = fs.readFileSync(webpackConfigPath, 'utf-8');
        // 添加 publicPath 配置
        webpackConfig = webpackConfig.replace(
          /publicPath:\s*['"]\/['"]/,
          `publicPath: '/${template}/'`
        );
        fs.writeFileSync(webpackConfigPath, webpackConfig);
        console.log(`webpack.config.js 已更新`);
      }
    }

    // 匹配config.* 文件
    const templateDir = path.join(cwd, template);
    const configFilePath = getMatchedDirs(templateDir, reg, true)?.[0];
    console.log(`配置文件路径: ${configFilePath || '未找到'}`);

    if (configFilePath) {
      // 重写config.* 文件
      const readConfigFile = fs.readFileSync(configFilePath, 'utf-8');
      const newConfigFile = getNewConfigFile(readConfigFile, template);
      fs.writeFileSync(configFilePath, newConfigFile);
      console.log(`配置文件已更新`);
    }

    console.log(`开始安装依赖并构建...`);
    try {
      await execAsync(`pnpm install && pnpm run build`, { cwd: templateDir });
      console.log(`构建完成`);
    } catch (buildError) {
      console.error(`构建失败: ${buildError}`);
      continue;
    }

    // 拷贝dist文件夹到根目录并且重命名
    // webpack-react 使用 build 目录
    const outputDir = template === 'template-webpack-react' ? 'build' : 'dist';
    const distFilePath = path.join(cwd, template, outputDir);
    const newDistFilePath = path.join(cwd, '_site', template);
    console.log(`准备拷贝 ${outputDir}: ${distFilePath} -> ${newDistFilePath}`);

    if (!fs.existsSync(distFilePath)) {
      console.error(`${outputDir} 目录不存在: ${distFilePath}`);
      continue;
    }

    try {
      await fse.copy(distFilePath, newDistFilePath);
      console.log(`dist 目录已拷贝到 ${newDistFilePath}`);
    } catch (copyError) {
      console.error(`拷贝 dist 目录失败: ${copyError}`);
      continue;
    }
    console.log(`========== 模板 ${template} 处理完成 ==========\n`);
  }
  console.log(`configFilesReg 完成`);
}

const initTemplates = async (templates: TemplateConfig[]) => {
  for (const template of templates) {
    await execAsync(
      `node ./bin/index.js init ${template.name} --description "${template.description}" --type ${template.type} --template lite --buildToolType ${template.buildToolType}`
    );
  }
};

/** 预定义模板列表 */
const TEMPLATES: TemplateConfig[] = [
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

const preview = async () => {
  try {
    // 创建 dist 目录
    mkdirSync('_site', { recursive: true });

    await initTemplates(TEMPLATES);

    // vite 模版重写 - 使用统一替换函数
    const generateViteConfig = (readConfigFile: string, template: string) => applyReplacementRules(readConfigFile, [
      { mate: 'defineConfig({', sub: `defineConfig({\n base: '/${template}',` },
      { mate: 'export default {', sub: `export default {\n base: '/${template}',` },
    ]);

    // farm 模版重写
    const generateFarmConfig = (readConfigFile: string, template: string) => applyReplacementRules(readConfigFile, [
      { mate: 'defineConfig({', sub: `defineConfig({ \n compilation: {\n output: {\n publicPath: '/${template}/',\n },\n },\n` },
    ]);

    // webpack 模版重写
    const generateWebpackConfig = (readConfigFile: string, template: string) => applyReplacementRules(readConfigFile, [
      { mate: 'module.exports = {', sub: `module.exports = {\n publicPath: '/${template}',\n` },
    ]);

    await configFilesReg(TEMPLATE_CONFIGS.vite, /^vite.config.*/, generateViteConfig);
    await configFilesReg(TEMPLATE_CONFIGS.farm, /^farm.config.*/, generateFarmConfig);
    await configFilesReg(TEMPLATE_CONFIGS.webpack, /^vue.config.*/, generateWebpackConfig);
  } catch (e) {
    console.error(e);
  }
};

preview().catch(e => console.error(e));