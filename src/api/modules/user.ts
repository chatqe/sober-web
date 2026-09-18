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
} from '../types';
import type { BaseReqVO } from '@/types/modules/baseReqVO';
import type { ChangeUserTypeParams } from '@/types/modules/changeUserTypeParams';
import type { ChangeUserStatus1Params } from '@/types/modules/changeUserStatus1Params';
import type { ChangeUserAdmireParams } from '@/types/modules/changeUserAdmireParams';

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

// 管理后台：分页查询用户列表
export const listUsers = async (params: BaseReqVO): Promise<any> => {
    const res = await request.post<any>('/admin/user/page', params, true);
    return res.data;
};

// 管理后台：修改用户类型
export const changeUserType = async (params: ChangeUserTypeParams): Promise<any> => {
    const res = await request.get<any>('/admin/user/changeUserType', params, true);
    return res.data;
};

// 管理后台：修改用户状态
export const changeUserStatus = async (params: ChangeUserStatus1Params): Promise<any> => {
    const res = await request.get<any>('/admin/user/changeUserStatus1', params, true);
    return res.data;
};

// 管理后台：修改用户赞赏信息
export const changeUserAdmire = async (params: ChangeUserAdmireParams): Promise<any> => {
    const res = await request.get<any>('/admin/user/changeUserAdmire', params, true);
    return res.data;
};

// 订阅/取消订阅专栏
export const subscribe = async (params: { labelId: number; flag: boolean }): Promise<any> => {
    const res = await request.post<any>('/behavior/subscribe', params, false);
    return res.data;
};

// 更新用户信息
export const updateUserInfo = async (userData: UserBase): Promise<UserDetail> => {
    const res = await request.post<UserDetail>('/user/updateUserInfo', userData);
    return res.data;
};

// 更新安全信息（手机号/邮箱/密码）
export const updateSecretInfo = async (params: any, _flag?: boolean, _code?: boolean): Promise<any> => {
    const res = await request.post('/user/updateSecretInfo', params, false, false);
    return res.data;
};

// 忘记密码重置密码
export const updateForForgetPassword = async (params: any, _flag?: boolean, _code?: boolean): Promise<any> => {
    const res = await request.post('/user/updateForForgetPassword', params, false, false);
    return res.data;
};

// 获取验证码
export const getCode = async (url: string, params: any): Promise<void> => {
    await request.get(url, params, false);
};
