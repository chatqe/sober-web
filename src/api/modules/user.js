/**
 * 用户模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request.js';

// 获取用户列表
export const getUserList = (params = {}) => {
    return request.get('/users', { params });
};

// 获取用户详情
export const getUserDetail = (userId) => {
    return request.get(`/users/${userId}`);
};

// 创建用户
export const createUser = (userData) => {
    return request.post('/users', userData);
};

// 更新用户信息
export const updateUser = (userId, updateData) => {
    return request.put(`/users/${userId}`, updateData);
};

// 删除用户
export const deleteUser = (userId) => {
    return request.delete(`/users/${userId}`);
};

// 批量操作示例
export const batchUpdateUsers = (userIds, updateData) => {
    return request.patch('/users/batch-update', {
        userIds,
        updateData
    });
};
