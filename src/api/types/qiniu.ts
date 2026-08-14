/**
 * 七牛云模块类型定义
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

// 七牛云上传Token请求参数
export interface QiniuTokenParams {
  key: string;
  [key: string]: any;
}

// 七牛云上传Token响应数据
export interface QiniuTokenResponse {
  uptoken: string;
  [key: string]: any;
}

// 七牛云文件信息
export interface QiniuFileInfo {
  key: string;
  hash: string;
  fsize: number;
  mimeType: string;
  putTime: number;
  [key: string]: any;
}

// 七牛云文件列表查询参数
export interface QiniuFileListParams {
  bucket?: string;
  prefix?: string;
  marker?: string;
  limit?: number;
  delimiter?: string;
  [key: string]: any;
}

// 七牛云文件列表响应
export interface QiniuFileListResponse {
  items: QiniuFileInfo[];
  marker?: string;
  commonPrefixes?: string[];
  [key: string]: any;
}

// 七牛云文件删除参数
export interface QiniuFileDeleteParams {
  key: string;
  [key: string]: any;
}
