/**
 * 友链资源模块类型定义
 *
 * @author Joy
 * @since 2026-01-03 17:10
 */

// 友情链接基础接口 (对应后端 WeblinksVO)
export interface FriendLinkBase {
  id?: number;
  title?: string;
  classify?: string;
  cover?: string;
  url: string;
  type?: string;
  remark?: string;
  status?: boolean;
  introduction?: string;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 友情链接详情接口
export interface FriendLinkDetail extends FriendLinkBase {
  id: number;
  title: string;
  url: string;
  createTime: string;
  [key: string]: any;
}

// 网站信息接口
export interface WebInfo {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  keywords?: string;
  logo?: string;
  favicon?: string;
  [key: string]: any;
}

// 分类信息接口
export interface SortInfo {
  id: number;
  name: string;
  parentId?: number;
  children?: SortInfo[];
  [key: string]: any;
}
