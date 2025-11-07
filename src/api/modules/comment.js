/**
 * 评论模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request';

// 获取评论列表
export const bossCommentList = (params) => {
    return request.post('/comment/boss/list', params, true);
};

export const userCommentList = (params) => {
    return request.post('/comment/user/list', params, true);
};

// 删除评论
export const delUserComment = (params) => {
    return request.get('comment/user/deleteComment', params, true);
};
export const delAdminComment = (params) => {
    return request.get('comment/boss/deleteComment', params, true);
};


export const listComment = (params) => {
    return request.post('/comment/listComment', params, false);
};
export const getCommentTotal = (params) => {
    return request.get('/comment/getCommentCount', params, false);
};