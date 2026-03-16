import path from 'path';
import fs from 'fs';
import coreTemplateVue2Config from '../core-template/CoreTemplateVue2Config';
import { IParsedSourceData } from '../CoreParsedConfig';
import { deleteAsync } from 'del';
import { ICoreTemplate } from '../core-template/CoreTemplateVue2Config';

// ===================== 拆分内容 ==============================
// 分离头部
const headerFlag = 'export default ';

// 特殊图标
const layersIconFlag = new RegExp(/icon: LayersIcon/gi);
const layersIconFlagRestore = 'icon: "LayersIcon"';

const edit1IconFlag = new RegExp(/icon: Edit1Icon/gi);
const edit1IconFlagRestore = 'icon: "Edit1Icon"';

const viewModuleIconFlag = new RegExp(/icon: ViewModuleIcon/gi);
const viewModuleIconFlagRestore = 'icon: "ViewModuleIcon"';

const listIconFlag = new RegExp(/icon: ListIcon/gi);
const listIconFlagRestore = 'icon: "ListIcon"';

const formIconFlag = new RegExp(/icon: FormIcon/gi);
const formIconFlagRestore = 'icon: "FormIcon"';

const detailIconFlag = new RegExp(/icon: DetailIcon/gi);
const detailIconFlagRestore = 'icon: "DetailIcon"';

// layout flag
const layoutFlag = new RegExp(/component: Layout/gi);
const layoutFlagRestore = 'component: "Layout"';

// import flag
const importFlag = new RegExp(/\(\) => import\(/gi);
const importFlagRestore = '"() => import(';

// import flag
const extFlag = new RegExp(/\.vue'\)/gi);
const extFlagRestore = `.vue')"`;
// ===================== 拆分内容 ==============================

// ===================== 还原内容 ==============================
// 特殊图标
const layersIconFlagBack = new RegExp(/icon: "LayersIcon"/gi);
const layersIconFlagRestoreBack = 'icon: LayersIcon';

const edit1IconFlagBack = new RegExp(/icon: "Edit1Icon"/gi);
const edit1IconFlagRestoreBack = 'icon: Edit1Icon';

const viewModuleIconFlagBack = new RegExp(/icon: "ViewModuleIcon"/gi);
const viewModuleIconFlagRestoreBack = 'icon: ViewModuleIcon';

const listIconFlagBack = new RegExp(/icon: "ListIcon"/gi);
const listIconFlagRestoreBack = 'icon: ListIcon';

const formIconFlagBack = new RegExp(/icon: "FormIcon"/gi);
const formIconFlagRestoreBack = 'icon: FormIcon';

const detailIconFlagBack = new RegExp(/icon: "DetailIcon"/gi);
const detailIconFlagRestoreBack = 'icon: DetailIcon';

// layout flag
const layoutFlagBack = new RegExp(/component: "Layout"/gi);
const layoutFlagRestoreBack = 'component: Layout';

// import flag
const importFlagBack = new RegExp(/"\(\)/gi);
const importFlagRestoreBack = '()';

// import flag
const extFlagBack = new RegExp(/\.vue'\)"/gi);
const extFlagRestoreBack = `.vue')`;
// ===================== 还原内容 ==============================

export interface IOptionsFilter {
  /**
   * 去除生成目录内容 .github  .husky .vscode
   *
   * @returns {Promise<any>}
   *
   * @memberOf IOptionsFilter
   */
  clearUnusedDirectories(options: any, finalOptions: any): Promise<any>;

  /**
   * 排除模块
   *
   * @param {*} options
   * @param {*} finalOptions
   * @returns {*}
   *
   * @memberOf IOptionsFilter
   */
  excludeModules(options: any, finalOptions: any): any;

  /**
   * 生成原始配置
   *
   * @param {*} options
   * @param {*} finalOptions
   * @returns {*}
   *
   * @memberOf IOptionsFilter
   */
  generateModulesRoute(options: any, finalOptions: any): any;
}

/**
 * 过滤器 VUE2
 *
 * @export
 * @class CoreOptionsFilter
 */
export class CoreOptionsFilterForVue2 implements IOptionsFilter {
  /**
   * 前部内容
   *
   * @private
   * @type {string}
   * @memberOf CoreOptionsFilter
   */
  protected headerFlagFirst = '';

  /**
   * 去除生成目录内容 .github  .husky .vscode
   *
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async clearUnusedDirectories(options: any, finalOptions: any): Promise<any> {
    const localPath = `${process.env.PWD}/${options.name}`;
    // console.log('options.name==', localPath);

    try {
      await deleteAsync(path.join(localPath, '.github'));
      await deleteAsync(path.join(localPath, '.husky'));
      await deleteAsync(path.join(localPath, '.vscode'));
    } catch (error) {
      console.log('clearUnusedDirectories..', error);
    }
  }

  /**
   * 获取当前解析器配置
   *
   * @returns {ICoreTemplate}
   *
   * @memberOf CoreOptionsFilterForVue2
   */
  public getConfigTemplateInstanceData(): ICoreTemplate {
    return coreTemplateVue2Config;
  }

  /**
   * 排除不用内容
   *
   * @param { CreatorOptions } options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  public async excludeModules(options: any, finalOptions: any) {
    // hole finalOptions.selectTypes
    // 找出不在列表中的目录，即为需要排除内容
    const selectTypeList: Array<IParsedSourceData> = [];

    // 找出需要排除的
    const parsedConfigData = this.getConfigTemplateInstanceData().getParsedConfigData();
    for (let index = 0; index < parsedConfigData.length; index++) {
      const elementParsedData: IParsedSourceData = parsedConfigData[index];

      // 为空时代表要排除，返回值代表需要保留
      if (!this.checkFileNeedtoKeep(elementParsedData.meta.title, finalOptions)) {
        selectTypeList.push(elementParsedData);
      }
    }

    // 执行删除
    for (const iterator of selectTypeList) {
      const needToExcludeItem: IParsedSourceData = iterator;
      try {
        if (needToExcludeItem.name) {
          const delPath = path.join(`${process.env.PWD}/${options.name}`, `./src/pages/${needToExcludeItem.name}`);
          await deleteAsync(delPath);
          // console.log('delPath==', delPath);
        }
      } catch (error) {
        console.log('excludeModules error..', error);
      }
    }
  }

  /**
   * 检测是否需要保留内容
   *
   * @private
   * @param {*} finalOptions
   * @param {*} checkStr
   * @returns
   *
   * @memberOf CoreOptionsFilterForVue2
   */
  protected checkFileNeedtoKeep(checkStr: any, finalOptions: any) {
    let findStr = '';
    for (let index = 0; index < finalOptions.selectTypes.length; index++) {
      const elementSelectTypeItem: string = finalOptions.selectTypes[index];
      if (checkStr === elementSelectTypeItem) {
        findStr = elementSelectTypeItem;
        break;
      }
    }

    return findStr;
  }

  /**
   * 检测是否在配置列表中
   *
   * @private
   * @param {string} elementSelectTypeItem
   * @returns {IParsedSourceData}
   *
   * @memberOf CoreOptionsFilter
   */
  public checkNeedToExclude(elementSelectTypeItem: string): IParsedSourceData {
    let parsedSourceData: IParsedSourceData = { isInExcludeList: false };

    const parsedConfigData = this.getConfigTemplateInstanceData().getParsedConfigData();
    for (let index = 0; index < parsedConfigData.length; index++) {
      const elementParsedData: IParsedSourceData = parsedConfigData[index];

      if (elementParsedData.meta.title === elementSelectTypeItem) {
        parsedSourceData = elementParsedData;
        parsedSourceData.isInExcludeList = true;
        break;
      }
    }

    return parsedSourceData;
  }

  /**
   * 生成特定路由配置
   *
   * @param {{ type: import(} [options="./CoreTemplate"]
   *
   * @memberOf CoreOptionsFilter
   */
  public async generateModulesRoute(options: any, finalOptions: any) {
    // console.log('generateModulesRoute==');
    // 生成原始配置
    const sourceModulesData = this.generateSourceModulesData(options, finalOptions);

    // 生成排除目录后的路由配置
    const deletedTypeList = this.restoreSourceModulesRouterData(sourceModulesData, options, finalOptions);
    // console.log('保留的目录==', deletedTypeList);

    // 依据原始配置移除需要排除的目录
    await this.excludeSourceDeleteFolder(deletedTypeList, options, finalOptions);

    // 生成排除后的路由配置
    const saveedList = await this.generateExcludeRouter(deletedTypeList, sourceModulesData, options, finalOptions);

    // 保存路由配置文件
    this.saveRouterFilter(saveedList, this.getConfigTemplateInstanceData().getConfig(), options, finalOptions);
  }

  /**
   * 还原排除目录后的路由配置
   *
   * @private
   * @param {string} sourceModulesData
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  protected restoreSourceModulesRouterData(sourceModulesData: string, options: any, finalOptions: any) {
    // 找出不在列表中的目录，即为需要排除内容
    const keepedTypeList: Array<IParsedSourceData> = [];
    // 找出需要保留的
    for (let index = 0; index < finalOptions.selectTypes.length; index++) {
      const elementSelectTypeItem: string = finalOptions.selectTypes[index];
      const addToExcludeItem: IParsedSourceData = this.checkNeedToExclude(elementSelectTypeItem);

      if (!addToExcludeItem.isInExcludeList) {
        keepedTypeList.push(addToExcludeItem);
      }
    }

    return keepedTypeList;
  }

  /**
   * 依据原始配置移除需要排除的目录
   *
   * @private
   * @param {string} sourceModulesData
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  protected async excludeSourceDeleteFolder(keepedTypeList: Array<IParsedSourceData>, options: any, finalOptions: any) {
    for (const iterator of keepedTypeList) {
      const element: IParsedSourceData = iterator;
      const elementPath = `${process.env.PWD}/${options.name}/src/pages`;
      const delPath = path.join(elementPath, element.path || '');
      try {
        await deleteAsync(delPath);
        console.log('excludeSourceDeleteFolder delPath==', delPath);
      } catch (error) {
        console.log('excludeSourceDeleteFolder..', error);
      }
    }
  }

  /**
   * 生成排除后的路由配置
   *
   *
   * @memberOf CoreOptionsFilter
   */
  protected async generateExcludeRouter(deletedTypeList: Array<IParsedSourceData>, sourceModulesData: any, options: any, finalOptions: any) {
    // 找出不在列表中的目录，即为需要排除内容
    const saveedList = [];
    const selectTypeList: Array<IParsedSourceData> = [];

    // 找出需要排除的
    const parsedConfigData = this.getConfigTemplateInstanceData().getParsedConfigData();
    for (let index = 0; index < parsedConfigData.length; index++) {
      const elementParsedData: IParsedSourceData = parsedConfigData[index];

      // 为空时代表要排除，返回值代表需要保留
      if (!this.checkFileNeedtoKeep(elementParsedData.meta.title, finalOptions)) {
        selectTypeList.push(elementParsedData);
      }
    }

    // 添加需要添加的
    for (let index = 0; index < sourceModulesData.length; index++) {
      const elementSourceItem = sourceModulesData[index];
      if (this.needToKepItem(elementSourceItem, selectTypeList)) {
        saveedList.push(elementSourceItem);
      }
    }

    return saveedList;
  }

  /** 检测是否需要保留 */
  protected needToKepItem(elementSourceItem: any, selectTypeList: any): boolean {
    let isKeep = true;

    for (let indexKeepedTypeItem = 0; indexKeepedTypeItem < selectTypeList.length; indexKeepedTypeItem++) {
      const elementKeepedTypeItem: IParsedSourceData = selectTypeList[indexKeepedTypeItem];

      if (elementSourceItem.meta.title === elementKeepedTypeItem.meta.title) {
        isKeep = false;
        break;
      }
    }

    return isKeep;
  }

  /** 生成原始配置-START */
  public generateSourceModulesData(options: any, finalOptions: any, downloadConfigSource: any = '') {
    // 取单例配置
    let configDataVue = this.getConfigTemplateInstanceData().getConfig();

    if (downloadConfigSource) {
      configDataVue = downloadConfigSource;
    }

    // 转换正确JSON
    const configDataVueList = configDataVue.split(headerFlag);
    let configDataContent = '';
    if (configDataVueList && configDataVueList.length) {
      configDataContent = configDataVueList[1];
      this.headerFlagFirst = configDataVueList[0];

      // 特殊标识
      configDataContent = configDataContent.replace(layersIconFlag, layersIconFlagRestore);
      configDataContent = configDataContent.replace(edit1IconFlag, edit1IconFlagRestore);
      configDataContent = configDataContent.replace(viewModuleIconFlag, viewModuleIconFlagRestore);

      configDataContent = configDataContent.replace(listIconFlag, listIconFlagRestore);
      configDataContent = configDataContent.replace(formIconFlag, formIconFlagRestore);
      configDataContent = configDataContent.replace(detailIconFlag, detailIconFlagRestore);
      configDataContent = configDataContent.replace(layoutFlag, layoutFlagRestore);
      configDataContent = configDataContent.replace(importFlag, importFlagRestore);
      configDataContent = configDataContent.replace(extFlag, extFlagRestore);

      // 所有句柄加上"
      configDataContent = configDataContent.replace(/path:/gi, '"path":');
      configDataContent = configDataContent.replace(/name:/gi, '"name":');
      configDataContent = configDataContent.replace(/component:/gi, '"component":');
      configDataContent = configDataContent.replace(/redirect:/gi, '"redirect":');
      configDataContent = configDataContent.replace(/meta:/gi, '"meta":');
      configDataContent = configDataContent.replace(/title:/gi, '"title":');
      configDataContent = configDataContent.replace(/icon:/gi, '"icon":');
      configDataContent = configDataContent.replace(/children:/gi, '"children":');

      // 去除引号
      configDataContent = configDataContent.replace(/'/gi, '"');

      // 还原特殊引号
      configDataContent = configDataContent.replace(/"@\/pages/gi, "'@/pages");
      configDataContent = configDataContent.replace(/index.vue"/gi, "index.vue'");

      configDataContent = configDataContent.replace(/ +/gi, '');
      configDataContent = configDataContent.replace(/[\r\n]/gi, '');

      // 清除临时内容
      configDataContent = configDataContent.replace(/],/gi, ']');
      configDataContent = configDataContent.replace(/];/gi, ']');
      configDataContent = configDataContent.replace(/},},{/gi, '}},{');
      configDataContent = configDataContent.replace(/},]},{/gi, '}]},{');
      configDataContent = configDataContent.replace(/]},]/gi, ']}]');
      configDataContent = configDataContent.replace(/},}]},{/gi, '}}]},{');
      configDataContent = configDataContent.replace(/},},]}]/gi, '}}]}]');

      try {
        // console.log('Generate parsed content..', configDataContent);
        configDataContent = JSON.parse(configDataContent);
      } catch (error) {
        console.log('Generate json parse error..', error);
      }
    }

    return configDataContent;
  }

  /**
   * 生成路由配置文件-END
   *
   * @private
   * @param {any[]} saveedList
   * @param {string} configData
   *
   * @memberOf CoreOptionsFilter
   */
  protected saveRouterFilter(saveedList: any[], configData: string, options: any, finalOptions: any) {
    let configDataContent = JSON.stringify(saveedList);
    configDataContent = this.formatJson(configDataContent);

    // 还原标识
    configDataContent = configDataContent.replace(layersIconFlagBack, layersIconFlagRestoreBack);
    configDataContent = configDataContent.replace(edit1IconFlagBack, edit1IconFlagRestoreBack);
    configDataContent = configDataContent.replace(viewModuleIconFlagBack, viewModuleIconFlagRestoreBack);

    configDataContent = configDataContent.replace(listIconFlagBack, listIconFlagRestoreBack);
    configDataContent = configDataContent.replace(formIconFlagBack, formIconFlagRestoreBack);
    configDataContent = configDataContent.replace(detailIconFlagBack, detailIconFlagRestoreBack);
    configDataContent = configDataContent.replace(layoutFlagBack, layoutFlagRestoreBack);
    configDataContent = configDataContent.replace(importFlagBack, importFlagRestoreBack);
    configDataContent = configDataContent.replace(extFlagBack, extFlagRestoreBack);
    configDataContent = configDataContent.replace(/"component":"\(/gi, '"component":(');
    configDataContent = configDataContent.replace(/"Layout"/gi, 'Layout');
    configDataContent = configDataContent.replace(/"ListIcon"/gi, 'ListIcon');
    configDataContent = configDataContent.replace(/"FormIcon"/gi, 'FormIcon');
    configDataContent = configDataContent.replace(/"DetailIcon"/gi, 'DetailIcon');
    configDataContent = configDataContent.replace(/.vue"\)"/gi, '.vue")');

    // 移除引号
    configDataContent = configDataContent.replace('"LayersIcon"', 'LayersIcon');
    configDataContent = configDataContent.replace('"Edit1Icon"', 'Edit1Icon');
    configDataContent = configDataContent.replace('"ViewModuleIcon"', 'ViewModuleIcon');
    configDataContent = configDataContent.replace('"ListIcon"', 'ListIcon');
    configDataContent = configDataContent.replace('"FormIcon"', 'FormIcon');
    configDataContent = configDataContent.replace('"DetailIcon"', 'DetailIcon');

    // 预处理前部信息
    const headerFlagFirstList = this.headerFlagFirst.split(';');
    const headerFlags = headerFlagFirstList.filter((headerFlag) => configDataContent.includes(headerFlag.split(' ')[1]));
    headerFlags.push(headerFlagFirstList.slice(-1).toString());

    // 保留内容 {..export default...}
    const saveFileContent = `${headerFlags.join(';')}${headerFlag}${configDataContent}`;

    // 生成文件
    const elementPath = `${options.name}/src/`;
    try {
      fs.writeFileSync(path.join(elementPath, 'router/modules/components.ts'), saveFileContent);
    } catch (error) {
      console.log('saveRouterFilter..', error);
    }
  }

  /**
   * 格式化JSON
   *
   * @private
   * @param {string} jsonStr
   * @returns {string}
   *
   * @memberOf CoreOptionsFilterForVue2
   */
  protected formatJson(jsonStr: string): string {
    jsonStr = this.trimJson(jsonStr);

    const re = new RegExp('\\{|\\}|,|:', 'g'); // 匹配格式化后的json中的{},:
    let exec = null;
    let InvalidFs = 0;
    let InvalidBs = 0;
    // eslint-disable-next-line no-cond-assign
    while ((exec = re.exec(jsonStr))) {
      // 找{},:
      const frontToCurrent = exec.input.substr(0, exec.index + 1); // 匹配开头到当前匹配字符之间的字符串
      if (frontToCurrent.replace(/\\"/g, '').replace(/[^"]/g, '').length % 2 != 0) {
        // 测试当前字符到开头"的数量，为双数则被判定为目标对象
        if (exec[0] === '{') InvalidFs++;
        else if (exec[0] === '}') InvalidBs++;
        continue; // 不是目标对象，手动跳过
      }
      // eslint-disable-next-line no-useless-escape
      const keyTimesF = frontToCurrent.replace(/[^\{]/g, '').length - InvalidFs; // 找出当前匹配字符之前所有{的个数
      // eslint-disable-next-line no-useless-escape
      const keyTimesB = frontToCurrent.replace(/[^\}]/g, '').length - InvalidBs; // 找出当前匹配字符之前所有}的个数
      const indentationTimes = keyTimesF - keyTimesB; // 根据{个数计算缩进

      if (exec[0] === '{') {
        jsonStr = jsonStr.slice(0, exec.index + 1) + '\n' + '\t'.repeat(indentationTimes) + jsonStr.slice(exec.index + 1); // 将缩进加入字符串
      } else if (exec[0] === '}') {
        jsonStr = jsonStr.slice(0, exec.index) + '\n' + '\t'.repeat(indentationTimes) + jsonStr.slice(exec.index); // 将缩进加入字符串
        re.exec(jsonStr); // 在查找目标前面插入字符串会回退本次查找，所以手动跳过本次查找
      } else if (exec[0] === ',') {
        jsonStr = jsonStr.slice(0, exec.index + 1) + '\n' + '\t'.repeat(indentationTimes) + jsonStr.slice(exec.index + 1);
      } else if (exec[0] === ':') {
        jsonStr = jsonStr.slice(0, exec.index + 1) + ' ' + jsonStr.slice(exec.index + 1);
      } else {
        console.log(`匹配到了非法${exec[0]}`);
      }
    }
    return jsonStr === null ? 'Invalid value' : jsonStr;
  }

  /**
   * 初步格式化
   *
   * @private
   * @param {string} jsonStr
   * @returns {string}
   *
   * @memberOf CoreOptionsFilterForVue2
   */
  protected trimJson(jsonStr: string): string {
    try {
      jsonStr = jsonStr.replace(/'/g, '"');
      jsonStr = JSON.stringify(JSON.parse(jsonStr));
    } catch (error) {
      // 转换失败错误提示
      // console.error('json format error...', error);
    }
    return jsonStr;
  }
}
