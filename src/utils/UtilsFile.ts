import path from 'path';
import fs from 'fs';
import pkg from '../../package.json';

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
