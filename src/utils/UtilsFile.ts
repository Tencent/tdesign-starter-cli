import path from 'path';
import fs from 'fs';
import pkg from '../../package.json';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { CreatorOptions } from '../core/CoreIndex';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 路径
 * @param dir 文件夹
 * @returns
 */
export const pathResolve = (dir: string): string => {
	return path.join(__dirname, dir);
};

/**
 * 自动设置版本信息
 */
export const versionSet = (): any => {
	const vs: Array<any> = pkg.version.split('.');
	vs[2]++;
	if (vs[2] > 15) {
		vs[1]++;
		vs[2] = 0;
	}
	if (vs[1] > 15) {
		vs[0]++;
		vs[1] = 0;
		vs[2] = 0;
	}
	pkg.version = vs.join('.');
	fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), {
		encoding: 'utf8'
	});
};

/**
 * 获取目录名称
 * @returns
 */
export function getCurrentDirectoryBase(): string {
	return path.basename(process.cwd());
}

/**
 * 判断目录是否存在
 * @param filePath
 * @returns
 */
export function directoryExists(filePath: string): boolean {
	return fs.existsSync(filePath);
}

/**
 * 重写package.json file
 * @param filePath
 * @returns
 */
export function reWritePackageFile(options: CreatorOptions) {
	console.log('重写package.json file', options);
	const packagePath = path.join(options.name, 'package.json');
	const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
	console.log('重写package.json file', packageContent);
	packageContent.name = options.name;
	packageContent.description = options.description;

	// 去掉预装husky,因为不存在.git
	packageContent.scripts.prepare = "node -e \"if(require('fs').existsSync('.git')){process.exit(1)}\" || is-ci || husky install";

	// 写入配置
	fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2), {
		encoding: 'utf8'
	});
}