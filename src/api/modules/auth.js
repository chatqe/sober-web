/**
 * 认证模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request.js';

// 用户登录
export const login = (params) => {
    return request.post('/user/login', params, false, false);
};

// 用户退出
export const logout = () => {
    return request.get('/user/logout');
};

// 刷新 token
export const refreshToken = (refreshToken) => {
    return request.post('/auth/refresh', {refreshToken});
};

// 获取当前用户信息
export const getCurrentUser = () => {
    return request.get('/auth/me');
};
// 获取图形验证码
export const getCaptchaCode = (params) => {
    return request.get('/user/captcha', params, false);
};
// 图形验证码校验
export const captchaCheck = (params) => {
    return request.post('/user/captchaCheck', params, false, false);
};

// 邮箱验证码
export const emailCode = (params) => {
    return request.get('/user/mailCode', params, false);
};

