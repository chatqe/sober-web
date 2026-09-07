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
} from '../types/resource';


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
