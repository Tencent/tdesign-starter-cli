<p align="center">
  <a href="http://tdesgin.tencent.com/starter/vue/#/dashboard/base"><img src="https://tdesign.gtimg.com/starter/brand-logo.svg" /></a>
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

---

> 注意您的本机安装的Node版本需要`>=16`。[Why Node 16?](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## 安装

```shell
npm install tdesign-starter-cli -g
```

## 使用

`tdesign-starter-cli`命令符为`td-starter`

```sh
# 初始化项目
td-starter init

# 填写 项目名称、项目描述
? 请输入项目名称： [项目名称]
? 请输入项目描述： Base on tdesign-starter-cli

# 进入项目
cd [项目名称]

# 安装依赖
npm install

# 运行
# Mac OS or Windows
npm run dev 

# Linux
npm run dev:linux

# 启动访问
http://localhost:3001/
```

## 本地开发

`tdesign-starter-cli`命令符为`td-starter`

```sh
# 临听，自动刷新代码改动
npm run watch

# 本地调试 init为模拟CLI初始化参数 
npm run dev init
```

## 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-starter-cli/LICENSE)。
