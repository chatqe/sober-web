/**
 * 认证模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request.js';

// 用户登录
export const login = (credentials) => {
    return request.post('/user/login', {}, false,false);
};

// 用户退出
export const logout = () => {
    return request.get('/user/logout', {}, true);
};

// 刷新 token
export const refreshToken = (refreshToken) => {
    return request.post('/auth/refresh', { refreshToken });
};

// 获取当前用户信息
export const getCurrentUser = () => {
    return request.get('/auth/me');
};