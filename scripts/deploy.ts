/**
 * 部署脚本：初始化所有模板项目 → 重写配置（添加 base/publicPath）→ 安装依赖 → 构建 → 拷贝产物到 dist/
 *
 * 用法: pnpm run build && node --import tsx scripts/deploy.ts
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// ==================== 类型定义 ====================

/** init 命令所需的模板参数 */
interface TemplateInitConfig {
  /** CLI 传入的模板目录名，如 template-vite-vue3 */
  name: string;
  description: string;
  type: string;
  buildToolType: string;
}

/** 按构建工具分组的处理配置 */
interface BuildToolConfig {
  /** 匹配模板目录名的正则，如 /^template-vite/ */
  templateDirPattern: RegExp;
  /** 匹配构建配置文件名的正则，如 /^vite\.config\. */
  configFilePattern: RegExp;
  /** 生成添加 base/publicPath 后的配置内容 */
  generateConfig: (content: string, template: string) => string;
  /** 额外的配置文件重写（如 webpack-react 的 webpack.config.js） */
  rewriteExtraConfig?: (templateDir: string, template: string) => void;
  /** 构建输出目录名，默认 dist；可传函数按模板名动态判断 */
  outputDir?: string | ((template: string) => string);
}

// ==================== 工具函数 ====================

/** 获取目录下匹配正则的子文件夹名列表 */
const getMatchedDirs = (root: string, pattern: RegExp): string[] => {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && pattern.test(d.name))
    .map((d) => d.name);
};

/** 在目录中查找第一个匹配正则的文件，返回完整路径 */
const findConfigFile = (dir: string, pattern: RegExp): string | undefined => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && pattern.test(entry.name)) {
      return path.join(dir, entry.name);
    }
  }
  return undefined;
};

/** 对内容按规则做文本替换（每条规则仅替换首次匹配） */
const replaceContent = (content: string, rules: { match: string; replacement: string }[]): string => {
  let result = content;
  for (const { match, replacement } of rules) {
    if (result.includes(match)) {
      result = result.replace(match, replacement);
    }
  }
  return result;
};

// ==================== 核心流程 ====================

/** 步骤 1：使用 CLI 初始化单个模板项目 */
const initTemplate = async (template: TemplateInitConfig, cliBinPath: string): Promise<void> => {
  console.log(`[init] ${template.name} ...`);
  try {
    await execAsync(
      `node ${cliBinPath} init ${template.name} --description "${template.description}" --type ${template.type} --template lite --buildToolType ${template.buildToolType}`
    );
  } catch (err) {
    throw new Error(`模板 ${template.name} 初始化失败: ${err}`);
  }
};

/** 步骤 2：重写配置文件（注入 base / publicPath） */
const injectBasePath = (configFilePath: string, template: string, generateConfig: (content: string, template: string) => string) => {
  const content = fs.readFileSync(configFilePath, 'utf-8');
  fs.writeFileSync(configFilePath, generateConfig(content, template));
  console.log(`  配置已注入 base path: ${path.basename(configFilePath)}`);
};

/** 步骤 3：安装依赖 */
const installDeps = async (templateDir: string, template: string): Promise<void> => {
  console.log(`  [install] ...`);
  try {
    await execAsync('pnpm install', { cwd: templateDir });
  } catch (err) {
    throw new Error(`模板 ${template} 依赖安装失败: ${err}`);
  }
};

/** 步骤 4：构建 */
const buildTemplate = async (templateDir: string, template: string): Promise<void> => {
  console.log(`  [build] ...`);
  try {
    await execAsync('pnpm run build', { cwd: templateDir });
    console.log(`  构建完成`);
  } catch (err) {
    throw new Error(`模板 ${template} 构建失败: ${err}`);
  }
};

/** 步骤 5：拷贝构建产物到 dist/ */
const copyOutput = (cwd: string, template: string, outputDir: string): void => {
  const srcPath = path.join(cwd, template, outputDir);
  const destPath = path.join(cwd, 'dist', template);

  if (!fs.existsSync(srcPath)) {
    throw new Error(`模板 ${template} 的构建产物不存在: ${srcPath}`);
  }

  fs.cpSync(srcPath, destPath, { recursive: true });
  console.log(`  产物已拷贝: ${outputDir}/ -> dist/${template}/`);
};

/** 处理单个模板的完整流程 */
const processTemplate = async (template: string, cwd: string, config: BuildToolConfig): Promise<void> => {
  const templateDir = path.join(cwd, template);
  const outputDir = typeof config.outputDir === 'function' ? config.outputDir(template) : (config.outputDir ?? 'dist');
  console.log(`\n========== ${template} ==========`);

  // 额外配置重写（如 webpack-react 的 webpack.config.js）
  config.rewriteExtraConfig?.(templateDir, template);

  // 注入 base path 到构建配置
  const configFilePath = findConfigFile(templateDir, config.configFilePattern);
  if (configFilePath) {
    injectBasePath(configFilePath, template, config.generateConfig);
  } else {
    console.log(`  未找到构建配置文件，跳过 base path 注入`);
  }

  await installDeps(templateDir, template);
  await buildTemplate(templateDir, template);
  copyOutput(cwd, template, outputDir);
};

// ==================== 配置数据 ====================

/** 需要初始化的模板列表 */
const TEMPLATES: TemplateInitConfig[] = [
  { name: 'template-vite-vue3', description: '这是一个 Vite 构建的 Vue3 项目', type: 'vue3', buildToolType: 'vite' },
  { name: 'template-vite-vue2', description: '这是一个 Vite 构建的 Vue2 项目', type: 'vue2', buildToolType: 'vite' },
  { name: 'template-vite-react', description: '这是一个 Vite 构建的 React 项目', type: 'react', buildToolType: 'vite' },
  { name: 'template-farm-vue3', description: '这是一个 Farm 构建的 Vue3 项目', type: 'vue3', buildToolType: 'farm' },
  { name: 'template-farm-vue2', description: '这是一个 Farm 构建的 Vue2 项目', type: 'vue2', buildToolType: 'farm' },
  { name: 'template-farm-react', description: '这是一个 Farm 构建的 React 项目', type: 'react', buildToolType: 'farm' },
  { name: 'template-webpack-vue3', description: '这是一个 Webpack 构建的 Vue3 项目', type: 'vue3', buildToolType: 'webpack' },
  { name: 'template-webpack-vue2', description: '这是一个 Webpack 构建的 Vue2 项目', type: 'vue2', buildToolType: 'webpack' },
  { name: 'template-webpack-react', description: '这是一个 Webpack 构建的 React 项目', type: 'react', buildToolType: 'webpack' }
];

/** 各构建工具对应的配置重写规则 */
const BUILD_TOOL_CONFIGS: BuildToolConfig[] = [
  {
    templateDirPattern: /^template-vite/,
    configFilePattern: /^vite\.config/,
    generateConfig: (content, template) =>
      replaceContent(content, [
        { match: 'defineConfig({', replacement: `defineConfig({\n base: '/${template}',` },
        { match: 'export default {', replacement: `export default {\n base: '/${template}',` }
      ])
  },
  {
    templateDirPattern: /^template-farm/,
    configFilePattern: /^farm\.config/,
    generateConfig: (content, template) =>
      replaceContent(content, [
        { match: 'defineConfig({', replacement: `defineConfig({\n compilation: {\n output: {\n publicPath: '/${template}/',\n },\n },\n` }
      ])
  },
  {
    templateDirPattern: /^template-webpack/,
    configFilePattern: /^vue\.config/,
    generateConfig: (content, template) =>
      replaceContent(content, [{ match: 'module.exports = {', replacement: `module.exports = {\n publicPath: '/${template}',\n` }]),
    // webpack-react 额外需要处理 webpack.config.js
    rewriteExtraConfig: (templateDir, template) => {
      const webpackConfigPath = path.join(templateDir, 'webpack.config.js');
      if (!fs.existsSync(webpackConfigPath)) return;
      const content = fs.readFileSync(webpackConfigPath, 'utf-8');
      fs.writeFileSync(webpackConfigPath, content.replace(/publicPath:\s*['"]\/['"]/, `publicPath: '/${template}/'`));
      console.log(`  额外配置已更新: webpack.config.js`);
    },
    outputDir: (template) => (template.includes('react') ? 'build' : 'dist')
  }
];

// ==================== 入口 ====================

const main = async () => {
  const cliBinPath = path.resolve('bin/index.mjs');
  const cwd = process.cwd();

  // 0. 确保构建产物已存在
  if (!fs.existsSync(cliBinPath)) {
    throw new Error(`CLI 未构建，请先运行: pnpm run build`);
  }

  // 1. 创建产物根目录
  fs.mkdirSync(path.join(cwd, 'dist'), { recursive: true });

  // 2. 并行初始化所有模板项目
  console.log(`开始初始化 ${TEMPLATES.length} 个模板...`);
  await Promise.all(TEMPLATES.map((t) => initTemplate(t, cliBinPath)));
  console.log(`所有模板初始化完成`);

  // 3. 按构建工具分组，串行处理（每组内串行构建）
  for (const config of BUILD_TOOL_CONFIGS) {
    const templates = getMatchedDirs(cwd, config.templateDirPattern);
    if (templates.length === 0) continue;

    console.log(`\n----- 处理 ${config.templateDirPattern} 模板 (${templates.length} 个) -----`);
    for (const template of templates) {
      await processTemplate(template, cwd, config);
    }
  }

  // 4. 生成根 index.html 导航页（按构建工具分组）
  const templateDirs = fs
    .readdirSync(path.join(cwd, 'dist'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  // 按构建工具分组
  const groups: Record<string, string[]> = {};
  for (const name of templateDirs) {
    const match = name.match(/^template-(\w+)-/);
    const tool = match ? match[1] : 'other';
    (groups[tool] ??= []).push(name);
  }

  const toolDisplayName: Record<string, string> = { vite: 'Vite', webpack: 'Webpack', farm: 'Farm' };
  const frameworkIcon: Record<string, string> = { vue3: 'Vue 3', vue2: 'Vue 2', react: 'React' };

  const getFramework = (name: string): string => {
    if (name.includes('vue3')) return 'vue3';
    if (name.includes('vue2')) return 'vue2';
    if (name.includes('react')) return 'react';
    return '';
  };

  const groupsHtml = Object.entries(groups)
    .map(
      ([tool, names]) => `
      <div class="group">
        <h2>${toolDisplayName[tool] || tool}</h2>
        <div class="btn-group">
${names
  .map((name) => {
    const fw = getFramework(name);
    const label = frameworkIcon[fw] || name;
    return `          <a class="btn" href="./${name}/"><span class="fw-tag ${fw}">${label}</span></a>`;
  })
  .join('\n')}
        </div>
      </div>`
    )
    .join('\n');

  const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TDesign Starter Templates</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background: linear-gradient(135deg, #f0f5ff 0%, #f5f7fa 100%);
      color: #1a1a1a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container { max-width: 640px; width: 100%; padding: 48px 24px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 32px; font-weight: 700; color: #0052d9; margin-bottom: 4px; }
    .subtitle { font-size: 15px; color: #888; }
    .group { margin-bottom: 32px; }
    h2 {
      font-size: 14px;
      font-weight: 600;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e7e7e7;
    }
    .btn-group { display: flex; flex-wrap: wrap; gap: 10px; }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
      padding: 12px 24px;
      background: #0052d9;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all .2s ease;
    }
    .btn:hover { background: #003cab; box-shadow: 0 4px 12px rgba(0, 82, 217, .3); transform: translateY(-2px); }
    .btn:active { transform: translateY(0); box-shadow: none; }
    .fw-tag { display: inline-flex; align-items: center; gap: 4px; }
    .fw-tag.vue3::before, .fw-tag.vue2::before {
      content: "";
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #42b883;
    }
    .fw-tag.react::before {
      content: "";
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #61dafb;
    }
    .footer { text-align: center; margin-top: 40px; font-size: 13px; color: #bbb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TDesign Starter</div>
      <div class="subtitle">Select a template to preview</div>
    </div>
${groupsHtml}
    <div class="footer">Powered by TDesign Starter CLI</div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(cwd, 'dist', 'index.html'), indexHtml);
  console.log(`\n导航页已生成: dist/index.html (${templateDirs.length} 个模板, ${Object.keys(groups).length} 个分组)`);

  // 重命名 dist → _site，适配上游 CI 工作流（TDesignOteam/workflows）对 _site 目录的约定
  const distDir = path.join(cwd, 'dist');
  const siteDir = path.join(cwd, '_site');
  if (fs.existsSync(siteDir)) {
    fs.rmSync(siteDir, { recursive: true });
  }
  fs.renameSync(distDir, siteDir);
  console.log(`\n产物目录已重命名: dist/ → _site/`);

  console.log('\n✅ 全部部署完成');
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
