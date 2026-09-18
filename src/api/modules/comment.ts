/**
 * 评论模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request';
import { getComment } from '../generated/comment';
import type {
  CommentListParams,
  CommentListResponse,
  CommentDeleteParams,
  CommentCountResponse
} from '../types';

const commentGenerated = getComment();

// 保存评论
export const saveComment = async (comment: any): Promise<any> => {
    return commentGenerated.saveComment(comment);
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

// 获取评论列表（公共）
export const listComment = async (params: CommentListParams): Promise<CommentListResponse> => {
    const res = await request.post<CommentListResponse>('/comment/list', params, false);
    return res.data;
};

// 获取评论总数
export const getCommentTotal = async (bizId: number, type: string): Promise<CommentCountResponse> => {
    const res = await request.get<CommentCountResponse>('/comment/getCount', {bizId, type}, false);
    return res.data;
};
