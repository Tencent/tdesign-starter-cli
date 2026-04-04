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

[English](./README.md)  | 简体中文

> 注意您的本机安装的Node版本需要`>=16`。

## 安装

```shell
npm install tdesign-starter-cli -g
```

## 使用

### 交互式操作

```sh

# 初始化项目
td-starter init

# 填写 项目名称、项目描述
? 请输入项目名称： [project-name]
? 请输入项目描述： Base on tdesign-starter-cli
...

cd [project-name]

# 安装依赖
npm install

# 运行
npm run dev 

```

### Command Operation

```sh

# 初始化项目
td-starter init [project name] [root]

cd [project-name]

# 安装依赖
npm install

# 运行    
npm run dev 

```

#### 示例

``` sh
td-starter init tdesign-vue3-farm --type vue3 --buildToolType farm
```

``` sh
td-starter init tdesign-vue3-farm -type vue3 -bt farm
```

### 选项

| 选项                              | 描述                                                               |
|-------------------------------------|-----------------------------------------------------------------------------|
| -d, --description \<description>     | 项目描述 (默认: "Base on tdesign-starter-cli")           |
| -type, --type \<type>                | 项目框架 vue2 \| vue3 \| react \| miniProgram \| mobileVue (默认: "vue2") |
| -temp, --template \<template>        | 项目模板类型: lite \| all (默认: "lite")                        |
| -bt, --buildToolType \<buildToolType>| Lite 的构建工具: vite \| webpack (默认: "vite")           |
| -h, --help                          | 显示命令的帮助                                                 |

## i18n 国际化本地化

i18n 命令帮助你将拥有 i18n 实现的 Vue3 项目转换为本地化版本（移除 i18n 依赖）。

### 基础用法

#### 交互式操作
```sh
# 启动 i18n 本地化流程
td-starter i18n

# 根据提示输入目标项目路径
? 请输入目标项目路径： ./my-project
```

#### 命令行模式
```sh
# 直接指定目标项目路径
td-starter i18n --target ./my-project

# 缩写选项
td-starter i18n -t ./my-project
```

### 前置条件

- **项目类型**：仅支持**Vue3**项目且已配置 i18n
- **项目结构**：项目必须具有以下目录结构：
  ```
  src/
  └── locales/
      └── lang/
          ├── zh_CN.json  （或其他语言代码）
          ├── en_US.json
          └── ...
  ```

### 工作原理

i18n 命令执行以下操作：

1. **项目分析**：自动检测项目是否为已配置 i18n 的 Vue3 项目
2. **语言检测**：扫描 `src/locales/lang` 目录查找所有可用的语言文件
3. **语言选择**：提示选择本地化的目标语言
4. **文件处理**：替换所有 i18n 函数调用为静态字符串：
   - `this.$t('key')` → `'translated_value'`
   - `$t('key')` → `'translated_value'`
   - `t('key')` → `'translated_value'`

5. **结果统计**：显示以下统计信息：
   - 处理的文件数量
   - 进行的翻译替换次数

### 支持的语言格式

以下语言代码格式会自动识别：

| 语言代码 | 语言名称      |
|----------|--------------|
| zh_CN    | 简体中文     |
| zh_TW    | 繁體中文     |
| en_US    | English      |
| en       | English      |
| zh       | 中文         |
| ja       | 日本語       |
| ko       | 한국어       |
| fr       | Français     |
| de       | Deutsch      |
| es       | Español      |
| ru       | Русский      |

### 使用流程示例

```sh
# 第一步：启动 i18n 本地化
td-starter i18n

# 第二步：输入项目路径
? 请输入目标项目路径： /Users/username/my-vue3-project

# 第三步：系统检测项目类型
🔍 目标项目路径: /Users/username/my-vue3-project
✅ 检测到项目类型: vue3

# 第四步：系统扫描语言配置
🌍 可用语言：
   - 简体中文 (zh_CN)
   - English (en_US)

# 第五步：选择目标语言
? 请选择要本地化的目标语言： (使用方向键选择)
❯ 简体中文 (zh_CN)
  English (en_US)

# 第六步：处理完成
✅ 本地化完成！
   处理文件: 25 个
   替换条目: 156 个
```

### 重要提示

⚠️ **本地化后：**
- i18n 配置文件和导入语句**仍然保留**
- 如需完全移除 i18n 依赖，可能需要手动清理
- 建议测试应用程序以确保所有翻译正确替换
- 保留语言配置文件以备参考

### 常见问题排查

| 问题 | 解决方案 |
|------|---------|
| "无法识别项目类型" | 确保项目在正确位置有 `package.json`，且包含 Vue 3 依赖 |
| "未检测到语言配置" | 验证 `src/locales/lang` 目录存在且包含 `.json` 语言文件 |
| "未找到翻译: key.name" | 所选语言文件中缺少该翻译 key |
| 未处理任何文件 | 检查 `src` 目录中是否存在 `.vue`、`.ts` 或 `.js` 文件 |

### 高级用法

#### 验证替换效果
使用以下方式检查替换是否成功：
```sh
# 检查是否还存在 i18n 函数调用
grep -r "\$t(" src/ --include="*.vue" --include="*.ts" --include="*.js"

# 检查是否还存在 i18n 导入
grep -r "vue-i18n" src/ --include="*.ts" --include="*.js"
```

#### 手动清理（可选）
替换完成后，如需完全移除 i18n，可执行：
```sh
# 1. 移除 i18n 配置文件
rm -rf src/locales/

# 2. 从 package.json 中移除依赖
npm uninstall vue-i18n

# 3. 更新导入语句（手动或脚本）
# 删除 import { createI18n } from 'vue-i18n'
# 删除其他 i18n 相关导入
```

## 预览

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

### 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-starter-cli/LICENSE)。
