import { CoreOptionsFilterForVue2 } from "./CoreOptionsFilterForVue2";
import { ICoreTemplate } from "../core-template/CoreTemplateVue2Config";
import coreTemplateVue3Config from "../core-template/CoreTemplateVue3Config";

/**
 * 过滤器 VUE3
 *
 * @export
 * @class CoreOptionsFilter
 */
export class CoreOptionsFilterForVue3 extends CoreOptionsFilterForVue2 {

  /**
   * override 获取当前解析器配置
   *
   * @returns {ICoreTemplate}
   *
   * @memberOf CoreOptionsFilterForVue2
   */
   public getConfigTemplateInstanceData(): ICoreTemplate {
    return coreTemplateVue3Config;
  }
}
