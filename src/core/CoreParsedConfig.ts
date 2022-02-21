
/**
 * 数据结构接口
 *
 * @export
 * @interface IParsedSourceData
 */
 export interface IParsedSourceData {
  name?: string;
  path?: string;
  meta?: any;
  /** 是否需要在要排除的目录中 */
  isInExcludeList?: boolean;
}
