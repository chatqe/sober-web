/**
 * 文件上传模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request.js';
import { useAuthStore } from '@/stores/modules/auth';

/**
 * 上传模块API
 * 提供文件上传相关的功能
 */

const authStore = useAuthStore();

/**
 * 获取七牛云上传token
 * @param {string} key - 文件key
 * @param {boolean} isAdmin - 是否为管理员
 * @returns {Promise} - 返回上传token
 */
export const getUpToken = async (key, isAdmin = false) => {
  const config = isAdmin 
    ? { headers: { "Authorization": authStore.adminToken } }
    : { headers: { "Authorization": authStore.userToken } };
    
  return await request.get('/qiniu/getUpToken', { params: { key }, ...config });
};

/**
 * 上传文件到本地存储
 * @param {FormData} formData - 表单数据
 * @param {boolean} isAdmin - 是否为管理员
 * @param {Object} options - 上传选项
 * @returns {Promise} - 返回上传结果
 */
export const uploadFile = async (formData, isAdmin = false, options = {}) => {
  return await request.upload('/resource/upload', formData, isAdmin, options);
};

/**
 * 保存资源信息
 * @param {Object} resource - 资源信息
 * @param {boolean} isAdmin - 是否为管理员
 * @returns {Promise} - 返回保存结果
 */
export const saveResource = async (resource, isAdmin = false) => {
  return await request.post('/resource/saveResource', resource, isAdmin);
};

export default {
  getUpToken,
  uploadFile,
  saveResource
};