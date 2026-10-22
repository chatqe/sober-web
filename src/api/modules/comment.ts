/**
 * 评论模块
 *
 * 组件使用的是历史字段名（source/type/commentContent），
 * 后端 CommentVO 使用 bizId/commentType/content，本模块负责双向映射。
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request';
import { getComment } from '../generated/comment';
import type {
  CommentListParams,
  CommentListResponse,
  CommentDeleteParams
} from '../types';

const commentGenerated = getComment();

/**
 * 前端评论来源标识 → 后端 CommentTypeEnum 编码（1-文章 2-树洞留言 3-表白墙留言）
 * 后端只认数字编码或枚举描述，article/love/message 会被判为“评论来源类型不存在”
 */
const COMMENT_TYPE_MAP: Record<string, number> = {
  article: 1,
  '文章': 1,
  '文章评论': 1,
  message: 2,
  treehole: 2,
  weiyan: 2,
  '树洞': 2,
  '树洞留言': 2,
  love: 3,
  '表白墙': 3,
  '表白墙留言': 3
};

/**
 * 归一化评论类型：兼容数字、数字字符串、英文标识与后端中文描述
 * @param type 前端标识或后端编码
 * @returns 后端 CommentTypeEnum 编码，无法识别时返回 0
 */
function toCommentType(type: string | number | null | undefined): number {
  if (typeof type === 'number' && !Number.isNaN(type)) {
    return type;
  }
  const raw = String(type ?? '').trim();
  if (raw === '') {
    return 0;
  }
  const numeric = Number(raw);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  return COMMENT_TYPE_MAP[raw.toLowerCase()] ?? COMMENT_TYPE_MAP[raw] ?? 0;
}

/**
 * 子评论分页对象归一化（后端 childComments 是 MyBatis-Plus 的 Page）
 */
function normalizeCommentPage(page: any): any {
  if (!page || !Array.isArray(page.records)) {
    return page;
  }
  return { ...page, records: page.records.map(normalizeComment) };
}

/**
 * 后端 CommentVO → 组件字段
 * content→commentContent、authorId→userId、likeCnt→likeCount、
 * parentId→parentCommentId、replyToUserId→parentUserId
 */
function normalizeComment(item: any): any {
  if (!item) {
    return item;
  }
  const normalized: Record<string, any> = {
    ...item,
    userId: item.authorId ?? item.userId,
    commentContent: item.content ?? item.commentContent ?? '',
    likeCount: item.likeCnt ?? item.likeCount ?? 0,
    parentCommentId: item.parentId ?? item.parentCommentId,
    parentUserId: item.replyToUserId ?? item.parentUserId
  };
  if (item.childComments) {
    normalized.childComments = normalizeCommentPage(item.childComments);
  }
  return normalized;
}

// 保存评论
export const saveComment = async (comment: any): Promise<any> => {
  const replyToUserId = comment.replyToUserId ?? comment.parentUserId;
  const payload: {
    bizId: number;
    bizType: number;
    content: string;
    parentId: number;
    rootId: number;
    replyToUserId?: number;
  } = {
    bizId: comment.bizId ?? comment.source,
    bizType: toCommentType(comment.bizType ?? comment.type),
    content: comment.content ?? comment.commentContent ?? '',
    // 后端以 parentId=0 标识根评论，传 null 会导致根评论列表查不到
    parentId: comment.parentId ?? comment.parentCommentId ?? 0,
    rootId: comment.rootId ?? comment.floorCommentId ?? 0
  };
  if (replyToUserId !== null && replyToUserId !== undefined) {
    payload.replyToUserId = replyToUserId;
  }
  return commentGenerated.saveComment(payload);
};


// 获取评论列表（管理员）
export const bossCommentList = async (params: CommentListParams): Promise<CommentListResponse> => {
    const res = await request.post<CommentListResponse>('/admin/comment/list', params, true);
    return res.data;
};

// 获取评论列表（用户）
export const userCommentList = async (params: CommentListParams): Promise<CommentListResponse> => {
    const res = await request.post<CommentListResponse>('/comment/author/list', params, true);
    return res.data;
};

// 删除评论（用户）
export const delUserComment = async (params: CommentDeleteParams): Promise<boolean> => {
    const res = await request.get<boolean>('/admin/comment/user/deleteComment', params, true);
    return res.data;
};

// 删除评论（管理员）
export const delAdminComment = async (params: CommentDeleteParams): Promise<boolean> => {
    const res = await request.get<boolean>('/admin/comment/boss/deleteComment', params, true);
    return res.data;
};

// 获取评论列表（公共），返回已归一化的分页对象
// 返回类型为 any：后端 CommentVO 与本组件使用的 Comment 字段名不同，已在 normalizeComment 中统一
export const listComment = async (params: any): Promise<any> => {
  const payload: Record<string, any> = {
    bizId: params.bizId ?? params.source,
    // 后端按 current/size 分页；commentType 传数字字符串，与保存后清理计数缓存的 key 保持一致
    commentType: String(toCommentType(params.commentType ?? params.type)),
    current: params.current ?? params.pageNum ?? 1,
    size: params.size ?? params.pageSize ?? 10
  };
  const rootId = params.rootId ?? params.floorCommentId;
  if (rootId !== null && rootId !== undefined) {
    payload.rootId = rootId;
  }
  const res = await request.post<any>('/comment/list', payload, false);
  const data = res.data || {};
  return { ...data, records: (data.records || []).map(normalizeComment) };
};

// 获取评论总数（后端返回 Integer，request.get 已剥掉 R 信封）
export const getCommentTotal = async (bizId: number, type: string | number): Promise<number> => {
  const res = await request.get<number>('/comment/getCount', {bizId, type: toCommentType(type)}, false);
  return typeof res.data === 'number' ? res.data : 0;
};
