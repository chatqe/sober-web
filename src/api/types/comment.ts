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
  /** 业务类型：1-文章 2-树洞留言 3-表白墙留言 */
  bizType?: number;
  /** 父评论ID，0=根评论 */
  parentId?: number;
  /** 顶级祖先评论ID，0=自身为根 */
  rootId?: number;
  /** 回复目标用户ID */
  replyToUserId?: number;
  /** 评论人ID */
  authorId?: number;
  likeCnt?: number;
  /** 评论内容 */
  content: string;
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
  childComments?: CommentPageData;
  [key: string]: any;
}

/**
 * 评论分页数据（MyBatis-Plus Page 结构）
 */
export interface CommentPageData {
  records: CommentDetail[];
  total: number;
  current?: number;
  size?: number;
  pages?: number;
  [key: string]: any;
}

/**
 * 保存评论请求参数 (对应后端 CommentVO 入参)
 */
export interface CommentSaveParams {
  /** 业务主键ID，如文章ID、树洞ID等 */
  bizId: number;
  /** 业务类型：1-文章 2-树洞留言 3-表白墙留言 */
  bizType: number;
  /** 评论内容 */
  content: string;
  /** 父评论ID，0=根评论 */
  parentId?: number;
  /** 顶级祖先评论ID，0=自身为根 */
  rootId?: number;
  /** 回复目标用户ID */
  replyToUserId?: number;
  [key: string]: any;
}

// 评论列表查询参数 (对应后端 BaseReqVO)
export interface CommentListParams {
  /** 当前页 */
  current?: number;
  /** 每页大小 */
  size?: number;
  /** 业务主键ID，如文章ID、树洞ID等（必填） */
  bizId?: number;
  /** 业务类型：数字字符串 "1"/"2"/"3" 或描述 "文章评论"（必填） */
  commentType?: string;
  /** 顶级祖先评论ID；不传查根评论，传则查该楼下的子评论 */
  rootId?: number;
  [key: string]: any;
}

// 评论列表响应（后端 R<BaseReqVO>，data 为分页对象）
export interface CommentListResponse extends CommentPageData {
  [key: string]: any;
}

// 评论删除参数
export interface CommentDeleteParams {
  id: number;
  [key: string]: any;
}

// 评论总数响应（后端 R<Integer>，data 为数字）
export type CommentCountResponse = number;
