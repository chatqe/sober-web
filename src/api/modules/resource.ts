/**
 * 资源路径模块
 *
 * @author Joy
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request';
import type {
  ResourcePathListParams,
  ResourcePathListResponse,
  ResourcePathBase,
  ResourcePathDetail,
  ResourcePathDeleteParams
} from '../types';
import type { BaseReqVO } from '@/types/modules/baseReqVO';
import type { _DeleteParams } from '@/types/modules/_deleteParams';

// 获取资源路径列表
export const listResourcePath = async (params: ResourcePathListParams): Promise<ResourcePathListResponse> => {
    const res = await request.post<ResourcePathListResponse>('/file/list', params);
    return res.data;
};

// 保存资源路径
export const saveResourcePath = async (data: ResourcePathBase): Promise<ResourcePathDetail> => {
    const res = await request.post<ResourcePathDetail>('/file/save', data);
    return res.data;
};

// 删除资源路径
export const deleteResourcePath = async (id: number): Promise<boolean> => {
    const res = await request.post<boolean>('/file/delete', {id});
    return res.data;
};

// ===== 管理后台资源 API =====

// 获取资源列表（管理后台分页）
export const listResource = async (params: BaseReqVO): Promise<any> => {
    const res = await request.post<any>('/file/admin/list', params, true);
    return res.data;
};

// 删除资源
export const deleteResource = async (params: _DeleteParams): Promise<any> => {
    const res = await request.post<any>('/file/admin/delete', params, true);
    return res.data;
};

// 保存/更新资源路径
export const saveResource = async (data: ResourcePathBase): Promise<ResourcePathDetail> => {
    const res = await request.post<ResourcePathDetail>('/file/save', data, true);
    return res.data;
};

// 更新资源路径
export const updateResourcePath = async (data: ResourcePathBase): Promise<ResourcePathDetail> => {
    const res = await request.post<ResourcePathDetail>('/file/update', data);
    return res.data;
};

// 更改资源状态（暂不支持）
export const changeResourceStatus = async (params: any): Promise<any> => {
    return Promise.resolve(null);
};
