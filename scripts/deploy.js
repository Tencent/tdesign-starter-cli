import { promisify } from 'util';
import { exec } from 'child_process';
import fs, { cp } from 'fs';
import path from 'path';

/** 异步 exec 命令 */
const execAsync = promisify(exec);
/** 异步 cp 命令 */
const cpAsync = promisify(cp);

/**
 * 匹配文件 vite.config.js/ts  farm.config.js/ts
 */
const filesReg = (root, reg, isPath = false) => {
  // 获取根目录下的文件夹名称
  const dirs = fs.readdirSync(root, { withFileTypes: true })
    .map(dirent => dirent.name);

  if (!isPath) {
    return dirs.filter(dir => reg.test(dir));
  }
  return dirs.filter(dir => reg.test(dir)).map(dir => path.join(root, dir));
}

/**
 *  处理文件 vite.config.js/ts farm.config.js/ts 
 */
const configFilesReg = (configReg, reg, getNewConfigFile) => {
  const cwd = process.cwd();
  filesReg(cwd, configReg).forEach(async (template) => {

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
  });
}

const preview = async () => {
  // todo:从 template 循环执行
  try {
    await execAsync('pnpm run dev init template-vite-vue3 --description 这是一个vite构建的vue3项目 --type vue3 --template lite --buildToolType vite');
    await execAsync('pnpm run dev init template-vite-vue2 --description 这是一个vite构建的vue2项目 --type vue2 --template lite --buildToolType vite');
    await execAsync('pnpm run dev init template-vite-react --description 这是一个vite构建的react项目 --type react --template lite --buildToolType vite');

    await execAsync('pnpm run dev init template-farm-vue3 --description 这是一个farm构建的vue3项目 --type vue3 --template lite --buildToolType farm');
    await execAsync('pnpm run dev init template-farm-vue2 --description 这是一个farm构建的vue2项目 --type vue2 --template lite --buildToolType farm');
    await execAsync('pnpm run dev init template-farm-react --description 这是一个farm构建的react项目 --type react --template lite --buildToolType farm');

    // await execAsync('pnpm run dev init template-webpack-vue3 --description 这是一个webpack构建的vue3项目 --type vue3 --template lite --buildToolType webpack');
    // await execAsync('pnpm run dev init template-webpack-vue2 --description 这是一个webpack构建的vue2项目 --type vue2 --template lite --buildToolType webpack');
    // await execAsync('pnpm run dev init template-webpack-react --description 这是一个webpack构建的react项目 --type react --template lite --buildToolType webpack');

    // vite 模版
    const generateViteConfig = (readConfigFile, template) => readConfigFile.replace('defineConfig({', `defineConfig({\n base: '/${template}',`);
    configFilesReg(/^template-vite/, /^vite.config.*/, generateViteConfig);

    // farm 模版
    const generateFarmConfig = (readConfigFile, template) =>
      readConfigFile.replace('defineConfig({', `defineConfig({ \n compilation: {\n   output: {\n     publicPath: '/${template}',\n   },\n  },\n`);
    configFilesReg(/^template-farm/, /^farm.config.*/, generateFarmConfig);

    // webpack 模版
    // todo

  } catch (e) {
    console.error(e);
  }
};
preview();