/**
 * 评论模块类型定义
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

// 评论基础信息接口 (对应后端 CommentVO)
export interface CommentBase {
  id?: number;
  bizId?: number;
  bizType?: number;
  parentId?: number;
  replyToUserId?: number;
  authorId?: number;
  likeCnt?: number;
  content: string;
  rootId?: number;
  createTime?: string;
  parentUsername?: string;
  username?: string;
  avatar?: string;
  [key: string]: any;
}

// 评论详情接口
export interface CommentDetail extends CommentBase {
  id: number;
  bizId: number;
  bizType: number;
  content: string;
  createTime: string;
  username: string;
  avatar?: string;
  childComments?: CommentDetail[];
  [key: string]: any;
}

// 评论列表查询参数 (对应后端 BaseReqVO)
export interface CommentListParams {
  pageNum?: number;
  pageSize?: number;
  order?: string;
  desc?: boolean;
  bizId?: number;
  commentType?: string;
  rootId?: number;
  searchKey?: string;
  articleSearch?: string;
  recommendStatus?: boolean;
  sortId?: string;
  labelId?: number;
  userStatus?: number;
  userType?: number;
  userId?: number;
  resourceType?: number;
  status?: number;
  classify?: string;
  [key: string]: any;
}

// 评论列表响应
export interface CommentListResponse {
  list: CommentDetail[];
  total: number;
  [key: string]: any;
}

// 评论删除参数
export interface CommentDeleteParams {
  id: number;
  [key: string]: any;
}

// 评论总数响应
export interface CommentCountResponse {
  count: number;
  [key: string]: any;
}
