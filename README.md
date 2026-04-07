<p align="center">
  <a href="https://tdesign.tencent.com/starter"><img src="https://tdesign.gtimg.com/starter/brand-logo.svg" /></a>
</p>111

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
td-starter init [project name] [root]

cd [project-name]

# install dependencies
npm install

# run dev     
npm run dev 

```

#### Example

``` sh
td-starter init tdesign-vue3-farm --type vue3 --buildToolType farm
```

``` sh
td-starter init tdesign-vue3-farm -type vue3 -bt farm
```

### Command Options

| Option                              | Description                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| -d, --description \<description>     | description of a project (default: "Base on tdesign-starter-cli")           |
| -type, --type \<type>                | Code version vue2 \| vue3 \| react \| miniProgram \| mobileVue (default: "vue2") |
| -temp, --template \<template>        | Project template type: lite \| all (default: "lite")                        |
| -bt, --buildToolType \<buildToolType>| The construction tool for lite: vite \| webpack (default: "vite")           |
| -h, --help                          | display help for command                                                    |

## i18n Localization

The i18n command helps you convert Vue3 projects with i18n implementations to localized versions (removing i18n dependencies).

### Basic Usage

#### Interactive Mode
```sh
# Start the i18n localization process
td-starter i18n

# Then input the target project path when prompted
? 请输入目标项目路径： ./my-project
```

#### Command Mode
```sh
# Specify the target project path directly
td-starter i18n --target ./my-project

# Short option
td-starter i18n -t ./my-project
```

### Requirements

- **Project Type**: Currently only supports **Vue3** projects with i18n setup
- **Project Structure**: Your project must have the following directory structure:
  ```
  src/
  └── locales/
      └── lang/
          ├── zh_CN.json  (or other language codes)
          ├── en_US.json
          └── ...
  ```

### How It Works

The i18n command performs the following operations:

1. **Project Analysis**: Automatically detects if the project is a Vue3 project with i18n configuration
2. **Language Detection**: Scans the `src/locales/lang` directory to find all available language files
3. **Language Selection**: Prompts you to choose a target language for localization
4. **File Processing**: Replaces all i18n function calls with static strings:
   - `this.$t('key')` → `'translated_value'`
   - `$t('key')` → `'translated_value'`
   - `t('key')` → `'translated_value'`

5. **Result Summary**: Shows statistics including:
   - Number of files processed
   - Number of translation replacements made

### Supported Language Formats

The following language code formats are automatically recognized:

| Language Code | Language Name      |
|---------------|-------------------|
| zh_CN         | 简体中文          |
| zh_TW         | 繁體中文          |
| en_US         | English           |
| en            | English           |
| zh            | 中文              |
| ja            | 日本語            |
| ko            | 한국어            |
| fr            | Français          |
| de            | Deutsch           |
| es            | Español           |
| ru            | Русский           |

### Example Workflow

```sh
# Step 1: Navigate to where tdesign-starter-cli is installed
td-starter i18n

# Step 2: Input project path
? 请输入目标项目路径： /Users/username/my-vue3-project

# Step 3: System detects project type
🔍 目标项目路径: /Users/username/my-vue3-project
✅ 检测到项目类型: vue3

# Step 4: System scans language configurations
🌍 可用语言：
   - 简体中文 (zh_CN)
   - English (en_US)

# Step 5: Select target language
? 请选择要本地化的目标语言： (Use arrow keys to select)
❯ 简体中文 (zh_CN)
  English (en_US)

# Step 6: Process completed
✅ 本地化完成！
   处理文件: 25 个
   替换条目: 156 个
```

### Important Notes

⚠️ **After localization:**
- The i18n configuration files and import statements are **still preserved**
- Manual cleanup may be required if you want to completely remove i18n dependencies
- Test your application to ensure all translations are correctly replaced
- Keep your language configuration files for reference

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "无法识别项目类型" | Ensure your project has `package.json` with Vue 3 dependencies in the correct location |
| "未检测到语言配置" | Verify the `src/locales/lang` directory exists and contains `.json` language files |
| "未找到翻译: key.name" | The translation key is missing in the selected language file |
| No files processed | Check if there are `.vue`, `.ts`, or `.js` files in the `src` directory |

### Advanced Usage

#### Verify Replacement Results
Use the following methods to check if the replacement was successful:
```sh
# Check if there are still i18n function calls
grep -r "\$t(" src/ --include="*.vue" --include="*.ts" --include="*.js"

# Check if there are still i18n imports
grep -r "vue-i18n" src/ --include="*.ts" --include="*.js"
```

#### Manual Cleanup (Optional)
After replacement, to completely remove i18n, you can execute:
```sh
# 1. Remove i18n configuration files
rm -rf src/locales/

# 2. Remove dependencies from package.json
npm uninstall vue-i18n

# 3. Update import statements (manually or via script)
# Delete import { createI18n } from 'vue-i18n'
# Delete other i18n related imports
```

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
