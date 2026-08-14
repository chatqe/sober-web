/**
 * 文件上传模块类型定义
 *
 * @author Joy
 * @since 2026-01-03 17:07
 */

// 七牛云上传token请求参数
export interface QiniuTokenParams {
  key: string;
  [key: string]: any;
}

// 七牛云上传token响应数据
export interface QiniuTokenResponse {
  uptoken: string;
  [key: string]: any;
}

// 上传选项接口
export interface UploadOptions {
  onProgress?: (progressEvent: any) => void;
  [key: string]: any;
}

// 资源信息接口
export interface ResourceInfo {
  id?: number;
  name: string;
  url: string;
  type: string;
  size: number;
  [key: string]: any;
}

// 资源上传响应
export interface UploadResponse {
  url: string;
  [key: string]: any;
}
