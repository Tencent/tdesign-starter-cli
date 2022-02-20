import path from "path";
import fs from 'fs';
import coreTemplateVue2Config from "../core-template/CoreTemplateVue2Config";
import { IParsedSourceData } from "../CoreParsedConfig";
import del from 'del';
import { ICoreTemplate } from "../core-template/CoreTemplateVue2Config";

// ===================== 拆分内容 ==============================
// 分离头部
const headerFlag = 'export default ';

// 特殊图标
const listIconFlag = new RegExp(/icon: ListIcon/ig);
const listIconFlagRestore = 'icon: "ListIcon"';

const formIconFlag = new RegExp(/icon: FormIcon/ig);
const formIconFlagRestore = 'icon: "FormIcon"';

const detailIconFlag = new RegExp(/icon: DetailIcon/ig);
const detailIconFlagRestore = 'icon: "DetailIcon"';

// layout falg
const layoutFlag = new RegExp(/component: Layout/ig);
const layoutFlagRestore = 'component: "Layout"';

// import flag
const importFlag = new RegExp(/\(\) => import\(/ig);
const importFlagRestore = '"() => import(';

// import flag
const extFlag = new RegExp(/\.vue'\)/ig);
const extFlagRestore = `.vue')"`;
// ===================== 拆分内容 ==============================


// ===================== 还原内容 ==============================
// 特殊图标
const listIconFlagBack = new RegExp(/icon: "ListIcon"/ig);
const listIconFlagRestoreBack = 'icon: ListIcon';

const formIconFlagBack = new RegExp(/icon: "FormIcon"/ig);
const formIconFlagRestoreBack = 'icon: FormIcon';

const detailIconFlagBack = new RegExp(/icon: "DetailIcon"/ig);
const detailIconFlagRestoreBack = 'icon: DetailIcon';

// layout falg
const layoutFlagBack = new RegExp(/component: "Layout"/ig);
const layoutFlagRestoreBack = 'component: Layout';

// import flag
const importFlagBack = new RegExp(/"\(\)/ig);
const importFlagRestoreBack = '()';

// import flag
const extFlagBack = new RegExp(/\.vue'\)"/ig);
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
  clearUnusedDirectorys(options: any, finalOptions: any): Promise<any>;

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
  private headerFlagFirst = '';

  /**
   * 去除生成目录内容 .github  .husky .vscode
   *
   * @param {*} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async clearUnusedDirectorys(options: any, finalOptions: any): Promise<any> {
    const localPath = `${process.env.PWD}/${options.name}`;
    // console.log('options.name==', localPath);

    try {
      await del(path.join(localPath, '.github'));
      await del(path.join(localPath, '.husky'));
      await del(path.join(localPath, '.vscode'));
    } catch (error) {
      console.log('clearUnusedDirectorys..', error);
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
   * @param {{ type: SupportedTemplate, name: string, description: string }} options
   * @param {*} finalOptions
   *
   * @memberOf CoreOptionsFilter
   */
   public async excludeModules(options: any, finalOptions: any) {
    // hole finalOptions.seletTypes
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
          await del(delPath);
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
  private checkFileNeedtoKeep(checkStr: any, finalOptions: any) {
    let findStr = '';
     for (let index = 0; index < finalOptions.seletTypes.length; index++) {
      const elementSelectTypeItem: string = finalOptions.seletTypes[index];
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
    let parsedSourceData: IParsedSourceData = {isInExcludeList: false};

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
    await this.excludeSouceDeleteFolder(deletedTypeList, options, finalOptions);

    // 生成排除后的路由配置
    const saveedList = await this.generateExcludeRouter(deletedTypeList, sourceModulesData, options, finalOptions);

    // 保存路由配置文件
    this.saveRouterFilter(saveedList, this.getConfigTemplateInstanceData().getConfig(), options, finalOptions);
  }

  /** 生成原始配置 */
  public generateSourceModulesData(options: any, finalOptions: any, downloadConfigSource: any = '') {
    // 取单例配置
    let configDataVue = this.getConfigTemplateInstanceData().getConfig();

    if (downloadConfigSource) {
      configDataVue = downloadConfigSource;
    }

    // 转换正确JSON
    // console.log('generateModulesRoute==', configDataVue);
    const configDataVueList = configDataVue.split(headerFlag);
    let configDataContent = '';
    if (configDataVueList && configDataVueList.length) {
      configDataContent = configDataVueList[1];
      this.headerFlagFirst = configDataVueList[0];

      // 特殊标识
      configDataContent = configDataContent.replace(listIconFlag, listIconFlagRestore);
      configDataContent = configDataContent.replace(formIconFlag, formIconFlagRestore);
      configDataContent = configDataContent.replace(detailIconFlag, detailIconFlagRestore);
      configDataContent = configDataContent.replace(layoutFlag, layoutFlagRestore);
      configDataContent = configDataContent.replace(importFlag, importFlagRestore);
      configDataContent = configDataContent.replace(extFlag, extFlagRestore);

      // 所有句柄加上"
      configDataContent = configDataContent.replace(/path:/ig, '"path":');
      configDataContent = configDataContent.replace(/name:/ig, '"name":');
      configDataContent = configDataContent.replace(/component:/ig, '"component":');
      configDataContent = configDataContent.replace(/redirect:/ig, '"redirect":');
      configDataContent = configDataContent.replace(/meta:/ig, '"meta":');
      configDataContent = configDataContent.replace(/title:/ig, '"title":');
      configDataContent = configDataContent.replace(/icon:/ig, '"icon":');
      configDataContent = configDataContent.replace(/children:/ig, '"children":');

      // 去除引号
      configDataContent = configDataContent.replace(/'/ig, '"');

      // 还原特殊引号
      configDataContent = configDataContent.replace(/"@\/pages/ig, "'@/pages");
      configDataContent = configDataContent.replace(/index.vue"/ig, "index.vue'");

      configDataContent = configDataContent.replace(/ +/ig, '');
      configDataContent = configDataContent.replace(/[\r\n]/ig, '');

      // 清除临时内容
      configDataContent = configDataContent.replace(/],/ig, "]");
      configDataContent = configDataContent.replace(/];/ig, "]");
      configDataContent = configDataContent.replace(/},},{/ig, "}},{");
      configDataContent = configDataContent.replace(/},]},{/ig, "}]},{");
      configDataContent = configDataContent.replace(/]},]/ig, "]}]");
      configDataContent = configDataContent.replace(/},}]},{/ig, "}}]},{");
      configDataContent = configDataContent.replace(/},},]}]/ig, "}}]}]");

      try {
        configDataContent = JSON.parse(configDataContent);
        // console.log('Generate parsed content..', configDataContent);
      } catch (error) {
        console.log('Generate json parse error..', error);
      }
    }

    return configDataContent;
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
  private restoreSourceModulesRouterData(sourceModulesData: string, options: any, finalOptions: any) {
     // 找出不在列表中的目录，即为需要排除内容
     const keepedTypeList: Array<IParsedSourceData> = [];
     // 找出需要保留的
     for (let index = 0; index < finalOptions.seletTypes.length; index++) {
       const elementSelectTypeItem: string = finalOptions.seletTypes[index];
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
  private async excludeSouceDeleteFolder(keepedTypeList: Array<IParsedSourceData>, options: any, finalOptions: any) {
    for (const iterator of keepedTypeList) {
      const element: IParsedSourceData = iterator;
      const elementPath = `${process.env.PWD}/${options.name}/src/pages`;
      const delPath = path.join(elementPath, element.path || '');
      try {
        await del(delPath);
        console.log('excludeSouceDeleteFolder delPath==', delPath);
      } catch (error) {
        console.log('excludeSouceDeleteFolder..', error);
      }
    }
  }

  /**
   * 生成排除后的路由配置
   *
   *
   * @memberOf CoreOptionsFilter
   */
  private async generateExcludeRouter(deletedTypeList: Array<IParsedSourceData>, sourceModulesData: any, options: any, finalOptions: any) {
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

    // console.log('selectTypeList..==', selectTypeList);
    // console.log('sourceModulesData..==', sourceModulesData);

    // 添加需要添加的
    for (let index = 0; index < sourceModulesData.length; index++) {
      const elementSourceItem = sourceModulesData[index];
     if (this.needToKepItem(elementSourceItem, selectTypeList)) {
      saveedList.push(elementSourceItem);
     }
    }
    // console.log('saveedList..==', saveedList);

    return saveedList;
  }

  /** 检测是否需要保留 */
  private needToKepItem(elementSourceItem: any, selectTypeList: any): boolean {
    let isKeep = true;

    for (let indexKeepedTypeItem = 0; indexKeepedTypeItem < selectTypeList.length; indexKeepedTypeItem++) {
      const elementKeepedTypeItem: IParsedSourceData = selectTypeList[indexKeepedTypeItem];

      if (elementSourceItem.meta.title === elementKeepedTypeItem.meta.title) {
        isKeep = false
        break;
      }
    }

    return isKeep;
  }

  /**
   * 生成路由配置文件
   *
   * @private
   * @param {any[]} saveedList
   * @param {string} configData
   *
   * @memberOf CoreOptionsFilter
   */
  private saveRouterFilter(saveedList: any[], configData: string, options: any, finalOptions: any) {
    let configDataContent = JSON.stringify(saveedList);
    configDataContent = this.formatJson(configDataContent);

    // 还原标识
    configDataContent = configDataContent.replace(listIconFlagBack, listIconFlagRestoreBack);
    configDataContent = configDataContent.replace(formIconFlagBack, formIconFlagRestoreBack);
    configDataContent = configDataContent.replace(detailIconFlagBack, detailIconFlagRestoreBack);
    configDataContent = configDataContent.replace(layoutFlagBack, layoutFlagRestoreBack);
    configDataContent = configDataContent.replace(importFlagBack, importFlagRestoreBack);
    configDataContent = configDataContent.replace(extFlagBack, extFlagRestoreBack);
    configDataContent = configDataContent.replace(/"component":"\(/ig, '"component":(');
    configDataContent = configDataContent.replace(/"Layout"/ig, 'Layout');
    configDataContent = configDataContent.replace(/"ListIcon"/ig, 'ListIcon');
    configDataContent = configDataContent.replace(/"FormIcon"/ig, 'FormIcon');
    configDataContent = configDataContent.replace(/"DetailIcon"/ig, 'DetailIcon');
    configDataContent = configDataContent.replace(/.vue"\)"/gi, '.vue")');

    // console.log('replace content..', configDataContent);

    // 保留内容 {..export default...}
    const saveFileContent = `${this.headerFlagFirst}${headerFlag}${configDataContent}`;

    // 生成文件
    const elementPath = `${options.name}/src/`;
    try {
      fs.writeFileSync(path.join(elementPath,'router/modules/components.ts'), saveFileContent);
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
  private formatJson(jsonStr: string): string {
    jsonStr = this.trimJson(jsonStr);

    // 匹配格式化后的json中的{},:
    const re = new RegExp('\\{|\\}|,|:', 'g');
    let exec = null;
    let InvalidFs = 0;
    let InvalidBs = 0;
    // eslint-disable-next-line no-cond-assign
    while(exec = re.exec(jsonStr)) {
      // 找{},:
      // 匹配开头到当前匹配字符之间的字符串
      const frontToCurrent = exec.input.substr(0, exec.index + 1);

      // 测试当前字符到开头"的数量，为双数则被判定为目标对象
      if (frontToCurrent.replace(/\\"/g, "").replace(/[^"]/g, "").length%2 != 0) {
        if(exec[0] === '{') InvalidFs++;
        else if(exec[0] === '}') InvalidBs++;

        // 不是目标对象，手动跳过
        continue;
      }
      // eslint-disable-next-line no-useless-escape
      const keyTimesF = frontToCurrent.replace(/[^\{]/g, '').length - InvalidFs; // 找出当前匹配字符之前所有{的个数

      // eslint-disable-next-line no-useless-escape
      const keyTimesB = frontToCurrent.replace(/[^\}]/g, '').length - InvalidBs; // 找出当前匹配字符之前所有}的个数

      // 根据{个数计算缩进
      const indentationTimes = keyTimesF - keyTimesB;

      if (exec[0] === '{') {
        // 将缩进加入字符串
        jsonStr = jsonStr.slice(0,exec.index + 1) + '\n' + '\t'.repeat(indentationTimes) + jsonStr.slice(exec.index + 1);
      } else if(exec[0] === '}') {
        // 将缩进加入字符串
        jsonStr = jsonStr.slice(0,exec.index) + '\n' + '\t'.repeat(indentationTimes) + jsonStr.slice(exec.index);
        // 在查找目标前面插入字符串会回退本次查找，所以手动跳过本次查找
        re.exec(jsonStr);
      } else  if(exec[0] === ',') {
        jsonStr = jsonStr.slice(0,exec.index + 1) + '\n' + '\t'.repeat(indentationTimes) + jsonStr.slice(exec.index + 1)
      } else if (exec[0] === ':') {
        jsonStr = jsonStr.slice(0,exec.index + 1) + ' ' + jsonStr.slice(exec.index + 1);
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
  private trimJson(jsonStr: string): string {
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
