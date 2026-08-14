/**
 * 认证模块类型定义
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

// 登录请求参数 (对应后端 POST /user/login: account, password, isAdmin)
export interface LoginParams {
  account: string;
  password: string;
  isAdmin?: boolean;
  [key: string]: any;
}

// 登录响应数据 (对应后端返回 R<UserVO>)
export interface LoginResponse {
  id: number;
  username: string;
  phoneNumber?: string;
  email?: string;
  gender?: number;
  avatar?: string;
  introduction?: string;
  isBoss?: boolean;
  accessToken?: string;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 用户信息接口
export interface UserInfo {
  id: number;
  username: string;
  phoneNumber?: string;
  email?: string;
  gender?: number;
  avatar?: string;
  introduction?: string;
  isBoss?: boolean;
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 刷新token请求参数 (对应后端 POST /user/token: userToken)
export interface RefreshTokenParams {
  userToken: string;
  [key: string]: any;
}

// 刷新token响应数据
export interface RefreshTokenResponse {
  id: number;
  username: string;
  avatar?: string;
  accessToken?: string;
  [key: string]: any;
}

// 验证码请求参数 (对应后端 GET /user/captcha: flag, email)
export interface CaptchaParams {
  flag?: boolean;
  email?: string;
  [key: string]: any;
}

// 验证码响应数据
export interface CaptchaResponse {
  uuid: string;
  img: string;
  [key: string]: any;
}

// 验证码校验请求参数 (对应后端 POST /user/captchaCheck: uuid, code)
export interface CaptchaCheckParams {
  uuid: string;
  code: string;
  [key: string]: any;
}

// 邮箱验证码请求参数 (对应后端 GET /user/mailCode: bizType, email)
export interface EmailCodeParams {
  bizType?: string;
  email: string;
  [key: string]: any;
}
