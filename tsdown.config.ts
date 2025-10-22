import { defineConfig } from 'tsdown'
import copy from 'rollup-plugin-copy';

export default defineConfig({
    entry: 'src/index.ts',
    platform: 'node',
    outDir: 'bin',
    exports: true,
    shims: true,
    dts: false,
    plugins: [
        // 复制templates文件; 复制 .gitignore 文件；添加.npmignore文件："!.gitignore\n.npmignore"
        copy({
            targets: [
                'templates/farm/vue-lite',
                'templates/farm/vue-next-lite',
                'templates/farm/react-lite',
                'templates/vite/vue-lite',
                'templates/vite/vue-next-lite',
                'templates/vite/react-lite',
                'templates/webpack/vue-lite',
                'templates/webpack/vue-next-lite',
                'templates/webpack/react-lite',
            ]
                .map((filePath) => [
                    {
                        src: [`${filePath}/*`, `${filePath}/.gitignore`, `!${filePath}/node_modules`],
                        dest: `bin/${filePath}`
                    },
                    {
                        src: `${filePath}/.gitignore`,
                        dest: `bin/${filePath}`,
                        rename: '.npmignore',
                        transform: () => Buffer.from('!.gitignore\n.npmignore', 'utf-8')
                    }
                ])
                .flat(),
            verbose: true
        })
    ],
})