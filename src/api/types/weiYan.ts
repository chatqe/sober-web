/**
 * 微言模块类型定义
 *
 * @author Joy
 * @since 2026-01-03 17:15
 */

// 微言基础信息接口 (对应后端 Moment 实体)
export interface WeiYanBase {
  id?: number;
  userId?: number;
  content: string;
  type?: string;
  source?: number;
  fileJson?: string;
  isPublic?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 微言详情接口
export interface WeiYanDetail extends WeiYanBase {
  id: number;
  content: string;
  createTime: string;
  updateTime: string;
  likes?: number;
  comments?: number;
  [key: string]: any;
}

// 微言列表查询参数 (对应后端 BaseReqVO)
export interface WeiYanListParams {
  pageNum?: number;
  pageSize?: number;
  order?: string;
  desc?: boolean;
  searchKey?: string;
  articleSearch?: string;
  recommendStatus?: boolean;
  [key: string]: any;
}

// 微言列表响应
export interface WeiYanListResponse {
  list: WeiYanDetail[];
  total: number;
  [key: string]: any;
}

// 微言删除参数
export interface WeiYanDeleteParams {
  id: number;
  [key: string]: any;
}
