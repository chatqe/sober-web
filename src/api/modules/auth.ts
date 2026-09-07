/**
 * 认证模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request';
import type {
  LoginParams,
  LoginResponse,
  UserInfo,
  RefreshTokenParams,
  RefreshTokenResponse,
  CaptchaParams,
  CaptchaResponse,
  CaptchaCheckParams,
  EmailCodeParams
} from '../types/auth';


// 用户登录
export const login = async (params: LoginParams): Promise<LoginResponse> => {
    const res = await request.post<LoginResponse>('/user/login', params, false, false);
    return res.data;
};

// 用户退出
export const logout = async (): Promise<void> => {
    await request.get('/user/logout');
};

// 刷新 token（后端无此接口，保留原实现供后续对接）
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    // TODO: 后端暂无 /auth/refresh 接口，待确认
    const res = await request.post<RefreshTokenResponse>('/user/token', {userToken: refreshToken}, false, false);
    return res.data;
};

// 获取当前用户信息（后端无 /auth/me 接口，使用 /user/me 或其他方式获取）
export const getCurrentUser = async (): Promise<UserInfo> => {
    // TODO: 后端暂无 /auth/me 接口，待确认实际路径
    const res = await request.get<UserInfo>('/user/me');
    return res.data;
};

// 获取图形验证码
export const getCaptchaCode = async (params: CaptchaParams): Promise<CaptchaResponse> => {
    const res = await request.get<CaptchaResponse>('/user/captcha', params, false);
    return res.data;
};

// 图形验证码校验
export const captchaCheck = async (params: CaptchaCheckParams): Promise<boolean> => {
    const res = await request.post<boolean>('/user/captchaCheck', params, false, false);
    return res.data;
};

// 邮箱验证码
export const emailCode = async (params: EmailCodeParams): Promise<void> => {
    await request.get('/user/mailCode', params, false);
};
