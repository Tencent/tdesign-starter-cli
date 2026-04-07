import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import inquirer from 'inquirer';

export type ProjectType = 'vue2' | 'vue3' | 'react' | 'unknown';

export interface I18nOptions {
  targetPath: string;
  projectType: ProjectType;
}

export interface LanguageConfig {
  code: string;
  name: string;
}

/** 语言代码到名称的映射 */
const LANG_NAME_MAP: Record<string, string> = {
  zh_CN: '简体中文',
  zh_TW: '繁體中文',
  en_US: 'English',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
};

/** 获取语言名称 */
function getLanguageName(code: string): string {
  return LANG_NAME_MAP[code] || code;
}

/**
 * 获取语言目录路径
 */
function getLanguageDir(basePath: string, _projectType: ProjectType): string | null {
  return path.join(basePath, 'src', 'locales', 'lang');
}

/**
 * 扫描语言配置
 */
async function scanLanguageDir(langDir: string): Promise<LanguageConfig[]> {
  if (!fs.existsSync(langDir)) return [];

  const languages: LanguageConfig[] = [];
  const entries = await fs.readdir(langDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      const code = entry.name.replace('.json', '');
      const name = getLanguageName(code);
      languages.push({ code, name });
    }
  }

  return languages;
}

/**
 * 扫描目标项目已有的语言
 */
export async function scanTargetLanguages(projectPath: string, projectType: ProjectType): Promise<LanguageConfig[]> {
  const langDir = getLanguageDir(projectPath, projectType);
  return langDir ? scanLanguageDir(langDir) : [];
}

/**
 * 解析版本号，获取主版本号
 */
function getMajorVersion(version: string): number | null {
  const cleanVersion = version.replace(/[^0-9.]/g, '');
  const major = parseInt(cleanVersion.split('.')[0], 10);
  return isNaN(major) ? null : major;
}

/**
 * 分析项目类型
 */
export async function analyzeProjectType(projectPath: string): Promise<ProjectType> {
  const pkgPath = path.join(projectPath, 'package.json');

  if (!fs.existsSync(pkgPath)) return 'unknown';

  const pkg = await fs.readJson(pkgPath);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  const vueVersion = deps['vue'] ? getMajorVersion(deps['vue']) : null;

  // 仅支持 Vue3 项目
  if (vueVersion !== null && vueVersion >= 3 && deps['vue-i18n']) return 'vue3';
  if (vueVersion !== null && vueVersion >= 3) return 'vue3';

  return 'unknown';
}

/**
 * 询问用户目标项目路径
 */
export async function askForTargetPath(): Promise<string> {
  const { targetPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetPath',
      message: '请输入目标项目路径：',
      default: './',
      validate: (input: string) => (input ? true : '请输入项目路径'),
    },
  ]);
  return targetPath;
}

/**
 * i18n 核心处理类 - 仅支持本地化功能
 */
export class CoreI18nHandler {
  private targetPath: string;

  constructor(options: I18nOptions) {
    this.targetPath = options.targetPath;
  }

  /**
   * 执行本地化：将 i18n 调用替换为本地字符串
   */
  async execute(projectType: ProjectType): Promise<void> {
    // 仅支持 Vue3 项目
    if (projectType !== 'vue3') {
      console.log(chalk.red('❌ 当前仅支持 Vue3 项目'));
      console.log(chalk.gray('   检测到的项目类型: ' + (projectType === 'unknown' ? '未知' : projectType)));
      return;
    }

    const spinner = ora('扫描项目语言配置...').start();

    const targetLanguages = await scanTargetLanguages(this.targetPath, projectType);

    if (targetLanguages.length === 0) {
      spinner.fail(chalk.red('未检测到语言配置，请确保项目包含 src/locales/lang 目录'));
      return;
    }

    spinner.succeed(chalk.green(`检测到 ${targetLanguages.length} 种语言配置`));

    // 显示可用语言
    console.log();
    console.log(chalk.blue('🌍 可用语言：'));
    targetLanguages.forEach((lang) => {
      console.log(chalk.gray(`   - ${lang.name} (${lang.code})`));
    });
    console.log();

    // 选择要本地化的语言
    const { selectedLang } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedLang',
        message: '请选择要本地化的目标语言：',
        choices: targetLanguages.map((lang) => ({
          name: `${lang.name} (${lang.code})`,
          value: lang,
        })),
      },
    ]);

    await this.localizeProject(selectedLang, projectType);
  }

  /**
   * 获取语言包内容
   */
  private async getLanguageContent(langCode: string): Promise<Record<string, any>> {
    const langFile = path.join(this.targetPath, 'src', 'locales', 'lang', `${langCode}.json`);

    if (!fs.existsSync(langFile)) {
      console.log(chalk.yellow(`⚠️ 未找到语言包: ${langFile}`));
      return {};
    }

    try {
      const content = await fs.readFile(langFile, 'utf-8');
      const nested = JSON.parse(content);
      return this.flattenObject(nested);
    } catch (error) {
      console.log(chalk.yellow(`⚠️ 解析语言包失败: ${langFile}`));
      return {};
    }
  }

  /**
   * 本地化项目 - 将 i18n 替换为本地字符串
   */
  private async localizeProject(lang: LanguageConfig, _projectType: ProjectType): Promise<void> {
    const spinner = ora(`加载 ${lang.name} 语言包...`).start();

    const langContent = await this.getLanguageContent(lang.code);

    if (!langContent || Object.keys(langContent).length === 0) {
      spinner.fail(chalk.red('语言包内容为空'));
      return;
    }
    spinner.succeed(chalk.green(`语言包加载成功，共 ${Object.keys(langContent).length} 个翻译条目`));

    spinner.start('扫描项目文件...');
    const srcDir = path.join(this.targetPath, 'src');
    const extensions = ['.vue', '.ts', '.js'];
    const files = await this.findFiles(srcDir, extensions);
    spinner.succeed(chalk.green(`找到 ${files.length} 个文件`));

    if (files.length === 0) {
      console.log(chalk.yellow('⚠️ 未找到需要处理的文件'));
      return;
    }

    let replaceCount = 0;
    let fileCount = 0;

    console.log(chalk.blue('🔄 开始处理文件...'));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      process.stdout.write(`\r   进度: ${i + 1}/${files.length} (${Math.round(((i + 1) / files.length) * 100)}%)`);

      // 跳过 i18n 配置目录
      if (file.includes('locales/') || file.includes('i18n/')) continue;

      const content = await fs.readFile(file, 'utf-8');
      const result = this.processFile(content, langContent);

      if (result.modified) {
        await fs.writeFile(file, result.content, 'utf-8');
        fileCount++;
        replaceCount += result.replaceCount;
        if (result.replaceCount > 0) {
          console.log(chalk.gray(`\n📝 ${path.basename(file)}: 替换 ${result.replaceCount} 个 t() 调用`));
        }
      }
    }

    process.stdout.write('\n');
    console.log(chalk.green(`\n✅ 本地化完成！`));
    console.log(chalk.gray(`   处理文件: ${fileCount} 个`));
    console.log(chalk.gray(`   替换条目: ${replaceCount} 个`));
    console.log();
    console.log(chalk.yellow('⚠️ 提示：i18n 配置和导入语句仍保留，如需完全移除请手动清理'));
  }

  /**
   * 处理文件内容 - 统一匹配所有 t() 调用
   */
  private processFile(content: string, langContent: Record<string, string>): { content: string; modified: boolean; replaceCount: number } {
    let newContent = content;
    let replaceCount = 0;

    // 匹配 this.$t('key'), $t('key'), t('key') 三种形式
    // 使用反向引用 \1 确保左右引号一致
    const patterns = [
      /this\.\$t\s*\(\s*(['"`])([a-zA-Z0-9_.]+)\1\s*\)/g,
      /\$t\s*\(\s*(['"`])([a-zA-Z0-9_.]+)\1\s*\)/g,
      /\bt\s*\(\s*(['"`])([a-zA-Z0-9_.]+)\1\s*\)/g,
    ];

    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(content)) !== null) {
        const key = match[2]; // key 在第二个捕获组
        const fullMatch = match[0];
        const value = this.getNestedValue(langContent, key);

        if (value !== undefined) {
          const replacement = `'${value}'`;
          // 使用 split + join 确保替换所有相同匹配
          newContent = newContent.split(fullMatch).join(replacement);
          replaceCount++;
        } else {
          console.log(chalk.yellow(`   ⚠️ 未找到翻译: ${key}`));
        }
      }
    }

    return { content: newContent, modified: replaceCount > 0, replaceCount };
  }

  /**
   * 展平嵌套对象
   */
  private flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, this.flattenObject(obj[key], newKey));
      } else if (typeof obj[key] === 'string') {
        result[newKey] = obj[key];
      }
    }

    return result;
  }

  /**
   * 从扁平化的 key 获取值
   */
  private getNestedValue(obj: Record<string, any>, key: string): string | undefined {
    if (obj[key] !== undefined) {
      return typeof obj[key] === 'string' ? obj[key] : undefined;
    }

    const keys = key.split('.');
    let value: any = obj;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return typeof value === 'string' ? value : undefined;
  }

  /**
   * 递归查找文件
   */
  private async findFiles(dir: string, extensions: string[]): Promise<string[]> {
    const results: string[] = [];

    if (!fs.existsSync(dir)) return results;

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          results.push(...(await this.findFiles(fullPath, extensions)));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) results.push(fullPath);
      }
    }

    return results;
  }
}

export default CoreI18nHandler;
