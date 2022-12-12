import CoreTsCompiler from './CoreTsCompiler';
import CoreSfcCompiler from './CoreSfcCompiler';
import CoreCodeReplace from './CoreCodeReplace';
import path from 'path';
import shell from 'shelljs';
import glob from 'glob';
import fs from 'fs';
export interface IJsTransformer {
  /**
   * 转换ts文件
   */
  transformTsFiles(options: { name: string }): Promise<any>;
  /**
   * vue项目 转换sfc文件
   */
  transformSfcFiles(options: { name: string }): Promise<any>;
  /**
   * 转换部分项目内特定存在的代码 如main.ts -> main.js
   */
  codeReplace(options: { name: string }): Promise<any>;
  /**
   * 格式化文件
   */
  prettierFiles(options: { name: string }): Promise<any>;
  /**
   * 去除多余的ts文件
   */
  clearTsFiles(options: { name: string }): Promise<any>;
}

export class CoreJsTransformer implements IJsTransformer {
  public async transformTsFiles(options: { name: string }) {
    const destDir = path.resolve(process.cwd(), options.name);
    CoreTsCompiler(destDir);
  }

  public async transformSfcFiles(options: { name: string }) {
    const destDir = path.resolve(process.cwd(), options.name);
    CoreSfcCompiler(destDir);
  }
  public async codeReplace(options: { name: string }) {
    const destDir = path.resolve(process.cwd(), options.name);
    CoreCodeReplace(destDir);
  }
  public async prettierFiles(options: { name: string }) {
    const destDir = path.resolve(process.cwd(), options.name);
    shell.exec(`prettier --write ${destDir}`);
  }
  public async clearTsFiles(options: { name: string }) {
    const destDir = path.resolve(process.cwd(), options.name);
    const removeFiles = path.resolve(destDir, '**', '*');
    glob.glob(removeFiles, function (er, files) {
      files.forEach((file) => {
        if (/\.(ts|d.js)$/.test(file))
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          fs.unlink(file, () => {});
      });
    });
  }
}
