/**
 * 认证模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request';


/** 登录入参 */
export interface LoginReq {
    account: string
    password: string
}

/** 登录出参 */
export interface LoginResp {
    accessToken: string
    refreshToken: string
    expireAt: number
}

/** 刷新 token 入参 */
export interface RefreshTokenReq {
    refreshToken: string
}

/** 图形验证码入参 */
export interface CaptchaReq {
    flag: boolean
    email: string
}

/** 图形验证码校验入参 */
export interface CaptchaCheckReq {
    uuid: string
    code: string
}

/** 邮箱验证码入参 */
export interface EmailCodeReq {
    flag: number
    place: string
}

/* ===================== 接口实现 ===================== */

// 用户登录
export const login = (data: LoginReq) => {
    return request.post('/user/login', data, false, false);
};

// 用户退出
export const logout = () => {
    return request.get<null>('/user/logout');
};

// 刷新 token
export const refreshToken = (body: RefreshTokenReq) => {
    return request.post('/auth/refresh', body);
};

// 获取当前用户信息
export const getCurrentUser = () => {
    return request.get('/auth/me');
};
// 获取图形验证码
export const getCaptchaCode = (params: CaptchaReq) => {
    return request.get('/user/captcha', params, false);
};
// 图形验证码校验
export const captchaCheck = (data: CaptchaCheckReq) => {
    return request.post('/user/captchaCheck', data, false, false);
};

// 邮箱验证码
export const emailCode = (params: EmailCodeReq) => {
    return request.get('/user/mailCode', params, false);
};

