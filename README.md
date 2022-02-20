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
</p>

## 安装

```shell
npm install tdesign-starter-cli -g
```
<br/>

## 使用示例

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
npm run dev

# 启动访问
http://localhost:3001/
```

<br/>

## 支持命令行对照表
| 命令 | 作用说明 |
| ----------- | ----------- |
| td-starter init | 初始化工程生成，可选择全部或部份 |
| td-starter i | 初始化工程生成，可选择全部或部份，简化调用形式 |
| td-starter i vue -y | 生成VUE2模板工程 |
| td-starter i vue2 -y | 生成VUE2模板工程 |
| td-starter i vue3 -y | 生成VUE3模板工程 |
| td-starter i vue-next -y | 生成VUE3模板工程 |

<br/>

## 本地开发

`tdesign-starter-cli`命令符为`td-starter`

```sh
# 监听，自动刷新代码改动
npm run watch

# 本地调试
npm run dev

# 注意Tips:
后面紧接其它参数，例如: npm run dev i 代表初始化工程生成。详见 # 支持命令对照表
```
<br/>

## 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-starter-cli/LICENSE)。
