/**
 * 评论模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request';
import type {
  CommentListParams,
  CommentListResponse,
  CommentDeleteParams,
  CommentCountResponse,
  CommentSaveParams
} from '../types/comment';


// 获取评论列表（管理员）
export const bossCommentList = async (params: CommentListParams): Promise<CommentListResponse> => {
    const res = await request.post<CommentListResponse>('/admin/comment/boss/list', params, true);
    return res.data;
};

// 获取评论列表（用户）
export const userCommentList = async (params: CommentListParams): Promise<CommentListResponse> => {
    const res = await request.post<CommentListResponse>('/admin/comment/user/list', params, true);
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

/**
 * 获取评论列表（公共）
 *
 * 后端契约（POST /comment/list，body 为 BaseReqVO）：
 * - 不传 rootId：查询根评论（parentId=0），每条根评论自带第一页子评论（childComments，size=5）
 * - 传 rootId：查询该根评论楼下的子评论（按时间升序分页）
 *
 * @param {CommentListParams} params - { current, size, bizId, commentType, rootId? }
 *   - bizId：业务主键ID（文章ID/树洞ID等），必填
 *   - commentType：业务类型，数字字符串 "1"/"2"/"3"（1文章 2树洞 3表白墙），必填
 *   - rootId：根评论ID，不传查根评论
 * @returns {Promise<CommentListResponse>} 分页对象（裸业务数据，R<T> 信封已剥离）：{ records, total, current, size }
 */
export const listComment = async (params: CommentListParams): Promise<CommentListResponse> => {
    const res = await request.post<CommentListResponse>('/comment/list', params);
    return res.data;
};

/**
 * 保存评论（公共，需登录）
 *
 * 后端契约（POST /comment/save，body 为 CommentVO）：
 * - 根评论：{ bizId, bizType, content, parentId: 0, rootId: 0 }
 * - 回复：{ bizId, bizType, content, parentId: 直接父评论ID, rootId: 根评论ID, replyToUserId: 被回复用户ID }
 *
 * @param {CommentSaveParams} params - 评论内容
 * @returns {Promise<void>} 保存成功无业务数据返回
 */
export const saveComment = async (params: CommentSaveParams): Promise<void> => {
    const res = await request.post<void>('/comment/save', params);
    return res.data;
};

/**
 * 删除评论（公共，需登录，仅作者本人可删）
 *
 * @param {CommentDeleteParams} params - { id: 评论ID }
 * @returns {Promise<void>} 删除成功无业务数据返回
 */
export const deleteComment = async (params: CommentDeleteParams): Promise<void> => {
    const res = await request.get<void>('/comment/delete', params);
    return res.data;
};

/**
 * 获取评论总数（公共）
 *
 * 后端契约（GET /comment/getCount）：
 * @param {Object} params - 查询参数
 * @param {number} params.bizId - 业务主键ID（文章ID/树洞ID等）
 * @param {string} params.type - 业务类型，数字字符串 "1"/"2"/"3"
 * @returns {Promise<number>} 评论数量（裸业务数据）
 */
export const getCommentTotal = async (params: { bizId: number; type: string }): Promise<CommentCountResponse> => {
    const res = await request.get<CommentCountResponse>('/comment/getCount', params);
    return res.data;
};
