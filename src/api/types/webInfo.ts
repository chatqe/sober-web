/**
 * 网站信息模块类型定义
 *
 * @author sjq
 * @since 2025-10-28 19:25
 */

// 网站基础信息接口
export interface WebInfoBase {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  keywords?: string;
  logo?: string;
  favicon?: string;
  [key: string]: any;
}

// 网站详情接口
export interface WebInfoDetail extends WebInfoBase {
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 爱情照片接口
export interface LovePhoto {
  id: number;
  url: string;
  description?: string;
  createTime: string;
  [key: string]: any;
}

// 资源路径列表查询参数
export interface ResourcePathListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

// 资源路径列表响应
export interface ResourcePathListResponse {
  list: any[];
  total: number;
  [key: string]: any;
}

// 历史信息接口
export interface HistoryInfo {
  id: number;
  title: string;
  content: string;
  date: string;
  [key: string]: any;
}

// 树洞信息基础接口
export interface TreeHoleBase {
  id?: number;
  content: string;
  author?: string;
  [key: string]: any;
}

// 树洞信息详情接口
export interface TreeHoleDetail extends TreeHoleBase {
  id: number;
  content: string;
  author?: string;
  createTime: string;
  [key: string]: any;
}

// 树洞列表响应
export interface TreeHoleListResponse {
  list: TreeHoleDetail[];
  total: number;
  [key: string]: any;
}

// 有趣内容接口
export interface FunnyContent {
  id: number;
  title: string;
  content: string;
  url?: string;
  createTime: string;
  [key: string]: any;
}

// 收藏内容接口
export interface CollectContent {
  id: number;
  title: string;
  url: string;
  description?: string;
  createTime: string;
  [key: string]: any;
}
