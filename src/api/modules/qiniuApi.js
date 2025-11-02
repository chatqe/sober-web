/**
 * 七牛云 API 模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request.js';

/**
 * 获取七牛云上传 Token
 * @param {string} key - 文件键名
 * @returns {Promise}
 */
export const getUpToken = (key) => {
  return request.post('/qiniu/getUpToken', { key });
};

/**
 * 上传文件到七牛云
 * @param {string} qiniuUrl - 七牛云上传地址
 * @param {FormData} formData - 表单数据
 * @returns {Promise}
 */
export const uploadQiniu = (qiniuUrl, formData) => {
  return request.post(qiniuUrl, formData, false, true);
};

/**
 * 删除七牛云文件
 * @param {string} key - 文件键名
 * @returns {Promise}
 */
export const deleteQiniuFile = (key) => {
  return request.delete('/qiniu/delete', { key });
};

/**
 * 获取七牛云文件信息
 * @param {string} key - 文件键名
 * @returns {Promise}
 */
export const getQiniuFileInfo = (key) => {
  return request.get('/qiniu/fileInfo', { key });
};

/**
 * 获取七牛云文件列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const listQiniuFiles = (params) => {
  return request.get('/qiniu/list', params);
};
