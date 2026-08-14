/**
 * 资源路径模块类型定义
 *
 * @author Joy
 * @since 2025-10-29 19:30
 */

// 资源路径基础接口 (对应后端 FileBaseVO)
export interface ResourcePathBase {
  id?: number;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  fileType?: string;
  storageType?: number;
  accessUrl?: string;
  [key: string]: any;
}

// 资源路径详情接口 (对应后端 FileRespVO)
export interface ResourcePathDetail extends ResourcePathBase {
  createTime?: string;
  updateTime?: string;
  [key: string]: any;
}

// 资源路径列表查询参数
export interface ResourcePathListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

// 资源路径列表响应
export interface ResourcePathListResponse {
  list: ResourcePathDetail[];
  total: number;
  [key: string]: any;
}

// 资源路径删除参数
export interface ResourcePathDeleteParams {
  id: number;
  [key: string]: any;
}
