/**
 * 用户模块
 *
 * @author Joy
 * @since 2026-01-03 17:08
 */

import request from '@/utils/request';
import type {
  RegisterParams,
  UserListParams,
  UserListResponse,
  UserDetail,
  UserBase,
  ResetPasswordParams
} from '../types/user';


// 注册用户
export const register = async (params: RegisterParams): Promise<UserDetail> => {
    const res = await request.post<UserDetail>('/user/register', params);
    return res.data;
};

// 获取用户列表（管理后台）
export const getUserList = async (params: UserListParams = {}): Promise<UserListResponse> => {
    const res = await request.post<UserListResponse>('/admin/user/list', params, true);
    return res.data;
};

// 获取用户详情（按用户名）
export const getUserDetail = async (username: string): Promise<UserDetail> => {
    const res = await request.get<UserDetail>('/user/getUserByUsername', {username});
    return res.data;
};

// 根据邮箱重置密码
export const resetPwdForFgtPwd = async (userData: ResetPasswordParams): Promise<void> => {
    await request.post('/user/resetPwdForFgtPwd', userData, false, false);
};

// 更新用户信息
export const updateUser = async (userData: UserBase): Promise<UserDetail> => {
    const res = await request.post<UserDetail>('/user/updateUserInfo', userData);
    return res.data;
};
