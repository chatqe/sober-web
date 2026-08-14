/**
 * 全局类型定义入口
 *
 * 汇总导出组件中使用的业务类型，与 orval 生成的 API 类型（./modules/）分离。
 * 组件通过 @/types 导入业务类型，API 请求函数通过 ../../types/modules 导入 API 类型。
 *
 * @author Joy
 * @since 2026-08-15
 */

// 重新导出已有统一定义的类型
export type { CommonUtils } from '../utils/common';
export type { ApiResponse } from '../utils/request';

/**
 * 应用常量类型
 * 描述注入到组件中的 $constant 对象结构
 */
export interface AppConstants {
  [key: string]: any;
}

/**
 * 文章类型（组件业务层）
 */
export interface Article {
  id: number;
  articleTitle: string;
  articleCover?: string;
  username: string;
  createTime: string;
  [key: string]: any;
}

/**
 * 分页参数（兼容多种分页结构）
 */
export interface Pagination {
  current?: number;
  size?: number;
  pageNum?: number;
  pageSize?: number;
  total?: number;
  recommendStatus?: boolean;
  searchKey?: string;
  sortId?: number | null;
  articleSearch?: string;
  [key: string]: any;
}

/**
 * 古诗词（今日诗词 API 返回）
 */
export interface GuShi {
  content: string;
  origin: string;
  author: string;
  category: string;
}

/**
 * 文章列表 API 响应
 */
export interface ArticleApiResponse {
  data: {
    list: Article[];
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * 图片标题（用于 travel 页面照片分类）
 */
export interface PhotoTitle {
  classify: string;
  [key: string]: any;
}

/**
 * 图片分页参数
 */
export interface PhotoPagination {
  current?: number;
  size?: number;
  pageNum?: number;
  pageSize?: number;
  total?: number;
  resourceType?: string;
  classify?: string;
  [key: string]: any;
}

/**
 * 资源路径（友链、照片等资源）
 */
export interface ResourcePath {
  [key: string]: any;
}

/**
 * 树洞信息
 */
export interface TreeHole {
  id: number;
  message: string;
  createTime: string;
  [key: string]: any;
}

/**
 * 网站信息（组件业务层）
 */
export interface WebInfo {
  [key: string]: any;
}

/**
 * 分类信息
 */
export interface Sort {
  id: number;
  sortName: string;
  [key: string]: any;
}

/**
 * 标签信息
 */
export interface Label {
  id: number;
  labelName: string;
  sortId: number;
  [key: string]: any;
}

/**
 * 微言信息
 */
export interface WeiYan {
  id?: number;
  content: string;
  type?: string;
  source?: number;
  createTime?: string;
  [key: string]: any;
}

/**
 * 评论信息
 */
export interface Comment {
  id: number;
  source: number;
  type: string;
  userId: number;
  likeCount: number;
  commentContent: string;
  commentInfo: string;
  createTime: string;
  [key: string]: any;
}

/**
 * 排序项（组件业务层，区别于 orval 生成的 API 类型 SortItem）
 */
export interface SortItem {
  id: number;
  sortName: string;
  sortDescription: string;
  status: number;
  [key: string]: any;
}

/**
 * 注册参数
 */
export interface RegisterParams {
  [key: string]: any;
}

/**
 * 验证码请求参数
 */
export interface CaptchaReq {
  [key: string]: any;
}
