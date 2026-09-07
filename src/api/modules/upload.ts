/**
 * 文件上传模块
 *
 * @author Joy
 * @since 2026-01-03 17:07
 */

import request from '@/utils/request';
import {useAuthStore} from '@/stores/modules/auth';
import type {
  QiniuTokenResponse,
  UploadOptions,
  ResourceInfo,
  UploadResponse
} from '../types/upload';


/**
 * 上传模块API
 * 提供文件上传相关的功能
 */

const authStore = useAuthStore();

/**
 * 获取七牛云上传token
 * @param {string} key - 文件key
 * @param {boolean} isAdmin - 是否为管理员
 * @returns {Promise<QiniuTokenResponse>} - 返回上传token
 */
export const getUpToken = async (key: string, isAdmin: boolean = false): Promise<QiniuTokenResponse> => {
    try {
        // 使用现有的request.get方法，传递正确的params对象
        const res = await request.get<QiniuTokenResponse>('/qiniu/getUpToken', {key}, isAdmin);

        // 检查响应格式
        if (res && res.code === 200) {
            return res.data;
        } else if (res && res.code !== 200) {
            throw new Error(res.msg || '获取上传token失败');
        } else {
            throw new Error('服务异常！');
        }
    } catch (error) {
        console.error('获取七牛云上传token失败:', error);
        throw error;
    }
};

/**
 * 上传文件到本地存储
 * @param {FormData} formData - 表单数据
 * @param {boolean} isAdmin - 是否为管理员
 * @param {UploadOptions} options - 上传选项
 * @returns {Promise<UploadResponse>} - 返回上传结果
 */
export const uploadFile = async (formData: FormData, isAdmin: boolean = false, options: UploadOptions = {}): Promise<UploadResponse> => {
    const res = await request.upload<UploadResponse>('/resource/upload', formData, isAdmin, options);
    return res.data;
};

/**
 * 保存资源信息
 * @param {ResourceInfo} resource - 资源信息
 * @param {boolean} isAdmin - 是否为管理员
 * @returns {Promise<ResourceInfo>} - 返回保存结果
 */
export const saveResource = async (resource: ResourceInfo, isAdmin: boolean = false): Promise<ResourceInfo> => {
    const res = await request.post<ResourceInfo>('/resource/saveResource', resource, isAdmin);
    return res.data;
};

export default {
    getUpToken,
    uploadFile,
    saveResource
};
