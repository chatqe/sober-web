/**
 * 公共接口模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request';

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
