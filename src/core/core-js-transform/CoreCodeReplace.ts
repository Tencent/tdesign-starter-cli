import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

async function replaceCodeCallback(filePath: string) {
  fs.readFile(filePath, 'utf-8', (err, content) => {
    const res = content.replace(/\.ts/g, '.js');

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fse.outputFile(filePath, res, () => {});
  });
}

function walkSync(paramPath: string) {
  fs.readdirSync(paramPath, { withFileTypes: true }).forEach(function (dirent) {
    const filePath = path.join(paramPath, dirent.name);

    if (dirent.isFile()) {
      replaceCodeCallback(filePath);
    } else if (dirent.isDirectory()) {
      walkSync(filePath);
    }
  });
}

export default function CodeReplaceTransformer(rootPath: string) {
  fs.readdirSync(rootPath, { withFileTypes: true }).forEach(function (dirent) {
    const filePath = path.join(rootPath, dirent.name);

    if (dirent.isFile()) {
      replaceCodeCallback(filePath);
    } else if (dirent.isDirectory()) {
      walkSync(filePath);
    }
  });
}
