<p align="center">
  <a href="https://tdesign.tencent.com/starter"><img src="https://tdesign.gtimg.com/starter/brand-logo.svg" /></a>
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/tdesign-starter-cli">
    <img src="https://img.shields.io/npm/l/tdesign-starter-cli.svg?sanitize=true" alt="License" />
  </a>
  <a href="https://www.npmjs.com/package/tdesign-starter-cli">
    <img src="https://img.shields.io/npm/v/tdesign-starter-cli.svg?sanitize=true" alt="Version">
  </a>
    <a href="https://www.npmjs.com/package/tdesign-starter-cli">
    <img src="https://img.shields.io/node/v/tdesign-starter-cli" alt="Node">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-starter-cli">
    <img src="https://img.shields.io/npm/dm/tdesign-starter-cli" alt="Downloads">
  </a>
</p>

English | [简体中文](./README-zh_CN.md)

> Please note that the Node version installed on your local machine needs to be `>=16`.

## Install

```shell
npm install tdesign-starter-cli -g
```

## Usage

### Interactive Operation

```sh

# project initialization
td-starter init

# fill project name and description
? 请输入项目名称： [project-name]
? 请输入项目描述： Base on tdesign-starter-cli
...

cd [project-name]

# install dependencies
npm install
      
# run dev
npm run dev 

```

### Command Operation

```sh

# project initialization
td-starter init [root]

cd [project-name]

# install dependencies
npm install

# run dev     
npm run dev 

```

### Command Options

| Option                              | Description                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| -d, --description <description>     | description of a project (default: "Base on tdesign-starter-cli")           |
| -type, --type <type>                | Code version vue2 \| vue3 \| react \| miniProgram \| mobileVue (default: "vue2") |
| -temp, --template <template>        | Project template type: lite \| all (default: "lite")                        |
| -bt, --buildToolType <buildToolType>| The construction tool for lite: vite \| webpack (default: "vite")           |
| -h, --help                          | display help for command                                                    |

## Preview

### Vite + React/Vue2/Vue3

- [vite-react](https://tencent-tdesign-starter-cli.surge.sh/template-vite-react/index.html)
- [vite-vue2](https://tencent-tdesign-starter-cli.surge.sh/template-vite-vue2/index.html)
- [vite-vue3](https://tencent-tdesign-starter-cli.surge.sh/template-vite-vue3/index.html)

### Farm + React/Vue2/Vue3

- [farm-react](https://tencent-tdesign-starter-cli.surge.sh/template-farm-react/index.html)
- [farm-vue2](https://tencent-tdesign-starter-cli.surge.sh/template-farm-vue2/index.html)
- [farm-vue3](https://tencent-tdesign-starter-cli.surge.sh/template-farm-vue3/index.html)

### Webpack + React/Vue2/Vue3

- [webpack-react](https://tencent-tdesign-starter-cli.surge.sh/template-webpack-react/index.html)
- [webpack-vue2](https://tencent-tdesign-starter-cli.surge.sh/template-webpack-vue2/index.html)
- [webpack-vue3](https://tencent-tdesign-starter-cli.surge.sh/template-webpack-vue3/index.html)

### License

The MIT License. Please see [the license file](LICENSE) for more information.
