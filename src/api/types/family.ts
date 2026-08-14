/**
 * 家庭信息模块类型定义
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

// 家庭信息基础接口 (对应后端 FamilyVO)
export interface FamilyBase {
  id?: number;
  userId?: number;
  bgCover?: string;
  manCover?: string;
  womanCover?: string;
  manName?: string;
  womanName?: string;
  timing?: string;
  countdownTitle?: string;
  status?: boolean;
  countdownTime?: string;
  familyInfo?: string;
  likeCount?: number;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 家庭信息详情接口
export interface FamilyDetail extends FamilyBase {
  id: number;
  createTime: string;
  updateTime: string;
  [key: string]: any;
}

// 家庭信息列表响应
export interface FamilyListResponse {
  list: FamilyDetail[];
  total: number;
  [key: string]: any;
}

// 家庭信息删除参数
export interface FamilyDeleteParams {
  id: number;
  [key: string]: any;
}
