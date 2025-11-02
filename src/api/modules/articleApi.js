/**
 * 文章API模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request.js';

/**
 * 获取分类和标签列表
 * @returns {Promise}
 */
export const getSortAndLabel = async () => {
  return await request.get('/webInfo/listSortAndLabel');
};

/**
 * 根据ID获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise}
 */
export const getArticleById = async (id) => {
  return await request.get('/admin/article/getArticleById', { params: { id } });
};

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getArticleList = async (params) => {
  return await request.post('/article/listArticle', params);
};

/**
 * 获取文章列表带 sort
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const listSortArticle = async (params) => {
  return await request.get('/article/listSortArticle');
};

/**
 * 保存新文章
 * @param {Object} article - 文章数据
 * @returns {Promise}
 */
export const saveArticle = async (article) => {
  return await request.post('/article/saveArticle', article);
};

/**
 * 更新文章
 * @param {Object} article - 文章数据
 * @returns {Promise}
 */
export const updateArticle = async (article) => {
  return await request.post('/article/updateArticle', article);
};

/**
 * 修改文章状态
 * @param {Object} params - 状态参数
 * @returns {Promise}
 */
export const changeArticleStatus = async (params) => {
  return await request.post('/article/updateArticleStatus', params);
};

/**
 * 删除文章
 * @param {Object} params - 删除参数
 * @returns {Promise}
 */
export const deleteArticle = async (params) => {
  return await request.post('/article/deleteArticle', params);
};

/**
 * 获取七牛云上传token
 * @param {string} key - 文件key
 * @returns {Promise}
 */
export const getUpToken = async (key) => {
  return await request.get('/qiniu/getUpToken', { params: { key } });
};

/**
 * 上传文件到本地存储
 * @param {FormData} formData - 表单数据
 * @returns {Promise}
 */
export const uploadFile = async (formData) => {
  return await request.upload('/resource/upload', formData);
};

/**
 * 保存资源信息
 * @param {Object} resource - 资源信息
 * @returns {Promise}
 */
export const saveResource = async (resource) => {
  return await request.post('/resource/saveResource', resource);
};