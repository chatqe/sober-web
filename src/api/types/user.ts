/**
 * 用户模块类型定义
 *
 * @author Joy
 * @since 2026-01-03 17:08
 */

// 用户基础信息接口 (对应后端 UserVO)
export interface UserBase {
  id?: number;
  username: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  gender?: number;
  avatar?: string;
  introduction?: string;
  subscribe?: string;
  isBoss?: boolean;
  accessToken?: string;
  code?: string;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 用户详情接口
export interface UserDetail extends UserBase {
  id: number;
  username: string;
  phoneNumber?: string;
  email?: string;
  avatar?: string;
  introduction?: string;
  isBoss?: boolean;
  createTime: string;
  updateTime: string;
  [key: string]: any;
}

// 用户注册参数
export interface RegisterParams extends UserBase {
  code?: string;
  place?: string;
  flag?: number;
  [key: string]: any;
}

// 用户列表查询参数 (对应后端 BaseReqVO)
export interface UserListParams {
  pageNum?: number;
  pageSize?: number;
  order?: string;
  desc?: boolean;
  searchKey?: string;
  userStatus?: number;
  userType?: number;
  userId?: number;
  [key: string]: any;
}

// 用户列表响应
export interface UserListResponse {
  list: UserDetail[];
  total: number;
  [key: string]: any;
}

// 用户更新参数
export interface UpdateUserParams extends UserBase {
  [key: string]: any;
}

// 密码重置参数 (对应后端 POST /user/resetPwdForFgtPwd)
export interface ResetPasswordParams {
  email: string;
  bizType?: string;
  code: string;
  password: string;
  [key: string]: any;
}

// 登录参数 (对应后端 POST /user/login)
export interface LoginParams {
  account: string;
  password: string;
  isAdmin?: boolean;
  [key: string]: any;
}

// 登录响应
export interface LoginResponse {
  id: number;
  username: string;
  avatar?: string;
  accessToken?: string;
  [key: string]: any;
}

// 用户信息 (通用)
export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: number;
  createTime?: string;
  [key: string]: any;
}

// 图形验证码参数
export interface CaptchaParams {
  flag?: boolean;
  email?: string;
  [key: string]: any;
}

// 图形验证码响应
export interface CaptchaResponse {
  uuid: string;
  img: string;
  [key: string]: any;
}

// 图形验证码校验参数
export interface CaptchaCheckParams {
  uuid: string;
  code: string;
  [key: string]: any;
}

// 邮箱验证码参数
export interface EmailCodeParams {
  bizType?: string;
  email: string;
  [key: string]: any;
}
