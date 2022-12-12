import fs from 'fs';
import path from 'path';
import babel from '@babel/core';
import fse from 'fs-extra';

function fileWriteCallback(filePath: string) {
  fs.readFile(filePath, 'utf-8', (err, content) => {
    const transformedCode = babel.transform(content, {
      //   retainLines: true,
      plugins: [['@babel/plugin-transform-typescript']]
    })?.code;

    const jsPath = filePath.replace('ts', 'js');
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fse.outputFile(jsPath, transformedCode, () => {});
  });
}

function walkSync(paramPath: string) {
  fs.readdirSync(paramPath, { withFileTypes: true }).forEach(function (dirent) {
    const filePath = path.join(paramPath, dirent.name);

    if (dirent.isFile() && /\.(ts|tsx)$/.test(dirent.name)) {
      fileWriteCallback(filePath);
    } else if (dirent.isDirectory()) {
      walkSync(filePath);
    }
  });
}

export default function TsTransformer(rootPath: string) {
  fs.readdirSync(rootPath, { withFileTypes: true }).forEach(function (dirent) {
    const filePath = path.join(rootPath, dirent.name);

    if (dirent.isFile() && /\.(ts|tsx)$/.test(dirent.name)) {
      fileWriteCallback(filePath);
    } else if (dirent.isDirectory()) {
      walkSync(filePath);
    }
  });
}
