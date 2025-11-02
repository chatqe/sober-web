/**
 * 资源路径模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request.js';

// 获取资源路径列表
export const listResourcePath = (params) => {
  return request.post('/webInfo/listResourcePath', params);
};

// 保存资源路径
export const saveResourcePath = (data) => {
  return request.post('/webInfo/saveResourcePath', data);
};

// 更新资源路径
export const updateResourcePath = (data) => {
  return request.post('/webInfo/updateResourcePath', data);
};

// 删除资源路径
export const deleteResourcePath = (id) => {
  return request.get('/webInfo/deleteResourcePath', { params: { id } });
};