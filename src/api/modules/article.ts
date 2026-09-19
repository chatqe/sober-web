/**
 * 文章API模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from '@/utils/request';
import type {
  ArticleDetail,
  ArticleListParams,
  ArticleListResponse,
  ArticleBase,
  ArticleStatusParams,
  ArticleDeleteParams,
  QiniuTokenResponse,
  UploadResponse,
  ResourceInfo,
} from '../types';
import { getArticle } from '../generated/article';
import type { ListCategoryArticleResult } from '../generated/article';



/**
 * 根据ID获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise<ArticleDetail>} 文章详情
 */
export const getArticleById = async (id: number): Promise<ArticleDetail> => {
    const res = await request.get<ArticleDetail>('/article/getArticleById', {id});
    return res.data;
};

/**
 * 获取文章列表
 * @param {ArticleListParams} params - 查询参数
 * @returns {Promise<ArticleListResponse>} 文章列表
 */
export const getArticleList = async (params: ArticleListParams): Promise<ArticleListResponse> => {
    const res = await request.post<ArticleListResponse>('/article/listPage', params);
    return res.data;
};

/**
 * 获取分类文章列表（按分类ID分组）
 * @returns {Promise<ListCategoryArticleResult>} 分类文章映射
 */
export const listCategoryArticle = async (): Promise<ListCategoryArticleResult> => {
    return getArticle().listCategoryArticle();
};

/**
 * 获取文章列表带 sort
 * @param {ArticleListParams} params - 查询参数
 * @returns {Promise<ArticleListResponse>} 文章列表
 */
export const listSortArticle = async (params: ArticleListParams): Promise<ArticleListResponse> => {
    const res = await request.get<ArticleListResponse>('/article/listSortArticle', params);
    return res.data;
};

/**
 * 保存新文章
 * @param {ArticleBase} article - 文章数据
 * @returns {Promise<ArticleDetail>} 保存后的文章详情
 */
export const saveArticle = async (article: ArticleBase): Promise<ArticleDetail> => {
    const res = await request.post<ArticleDetail>('/article/save', article);
    return res.data;
};

/**
 * 更新文章
 * @param {ArticleBase} article - 文章数据
 * @returns {Promise<ArticleDetail>} 更新后的文章详情
 */
export const updateArticle = async (article: ArticleBase): Promise<ArticleDetail> => {
    const res = await request.post<ArticleDetail>('/article/update', article);
    return res.data;
};

/**
 * 修改文章状态
 * @param {ArticleStatusParams} params - 状态参数 (id, desc, recommendStatus, viewStatus)
 * @returns {Promise<boolean>} 更新结果
 */
export const changeArticleStatus = async (params: ArticleStatusParams): Promise<boolean> => {
    const res = await request.get<boolean>('/admin/article/changeArticleStatus', params, true);
    return res.data;
};

/**
 * 删除文章
 * @param {ArticleDeleteParams} params - 删除参数 {id: number}
 * @returns {Promise<boolean>} 删除结果
 */
export const deleteArticle = async (params: ArticleDeleteParams): Promise<boolean> => {
    const res = await request.get<boolean>('/article/del', params, true);
    return res.data;
};

/**
 * 获取七牛云上传token
 * @param {string} key - 文件key
 * @returns {Promise<QiniuTokenResponse>} 七牛云上传token
 */
export const getUpToken = async (key: string): Promise<QiniuTokenResponse> => {
    const res = await request.get<QiniuTokenResponse>('/qiniu/getUpToken', {key});
    return res.data;
};

/**
 * 上传文件到本地存储
 * @param {FormData} formData - 表单数据
 * @returns {Promise<UploadResponse>} 上传结果
 */
export const uploadFile = async (formData: FormData): Promise<UploadResponse> => {
    const res = await request.upload<UploadResponse>('/resource/upload', formData);
    return res.data;
};

/**
 * 保存资源信息
 * @param {ResourceInfo} resource - 资源信息
 * @returns {Promise<ResourceInfo>} 保存后的资源信息
 */
export const saveResource = async (resource: ResourceInfo): Promise<ResourceInfo> => {
    const res = await request.post<ResourceInfo>('/resource/saveResource', resource);
    return res.data;
};

/**
 * 添加文章点赞数
 * @param {ArticleDTO} params - 文章ID、用户ID、操作类型
 * @returns {Promise<any>}
 */
export const addArticleLikeCount = async (params: {articleId: number, userId: number | null, operation: number}): Promise<any> => {
    const res = await request.post('/article/addArticleLikeCount', params);
    return res.data;
};

/**
 * 检查是否已点赞
 * @param {CheckHasLikeParams} params - 包含文章ID
 * @returns {Promise<boolean>}
 */
export const checkHasLike = async (params: {articleId: number}): Promise<boolean> => {
    const res = await request.get<boolean>('/article/checkHasLike', params);
    return res.data;
};
