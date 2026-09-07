/**
 * 七牛云 API 模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request';
import type {
  QiniuTokenResponse,
  QiniuFileInfo,
  QiniuFileListResponse,
  QiniuFileListParams,
  QiniuFileDeleteParams
} from '../types/qiniu';


/**
 * 获取七牛云上传 Token
 * @param {string} key - 文件键名
 * @returns {Promise<QiniuTokenResponse>}
 */
export const getUpToken = async (key: string): Promise<QiniuTokenResponse> => {
    const res = await request.get<QiniuTokenResponse>('/qiniu/getUpToken', {key});
    return res.data;
};

// 注意：后端目前只有 /qiniu/getUpToken 接口
// 以下接口后端暂未实现，保留供后续扩展

/**
 * 上传文件到七牛云
 * @param {string} qiniuUrl - 七牛云上传地址
 * @param {FormData} formData - 表单数据
 * @returns {Promise<any>}
 */
export const uploadQiniu = async (qiniuUrl: string, formData: FormData): Promise<any> => {
    const res = await request.post<any>(qiniuUrl, formData, false, true);
    return res.data;
};
