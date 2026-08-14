/**
 * 网站综合信息模块
 *
 * 整合网站信息、分类、友链等 API，提供 webApi 命名空间供组件使用。
 *
 * @author Joy
 * @since 2026-08-15
 */

import { getWebInfo as createWebInfoApi } from '../generated/web-info';
import { getWeblinks as createWeblinksApi } from '../generated/weblinks';
import { getCategory as createCategoryApi } from '../generated/category';

// 初始化 orval 生成的 API 工厂
const webInfoApi = createWebInfoApi();
const weblinksApi = createWeblinksApi();
const categoryApi = createCategoryApi();

/**
 * 网站综合信息 API
 * 提供网站信息查询、分类信息查询、友链管理等功能
 */
export const webApi = {
  /** 获取网站信息 */
  getWebInfo: webInfoApi.getWebInfo,
  /** 获取分类信息列表 */
  getSortInfo: categoryApi.list4,
  /** 保存友链 */
  saveFriend: weblinksApi.saveFriend,
  /** 查询友链列表 */
  listFriend: weblinksApi.listFriend,
};
