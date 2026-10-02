/**
 * 网站信息模块
 *
 * @author sjq
 * @since 2025-10-28 19:25
 */

import request from '@/utils/request';
import type {
  WebInfoDetail,
  LovePhoto,
  ResourcePathListParams,
  ResourcePathListResponse,
  HistoryInfo,
  FunnyContent,
  CollectContent
} from '../types';
import { getAdminCategory } from '../generated/admin-category';
import { getAdminTag } from '../generated/admin-tag';
import { getCategory } from '../generated/category';
import { getWebInfo as _getWebInfoApi } from '../generated/web-info';
import type { CategorySaveReqDTO } from '@/types/modules/categorySaveReqDTO';
import type { TagSaveReqDTO } from '@/types/modules/tagSaveReqDTO';

const _adminCategoryApi = getAdminCategory();
const _adminTagApi = getAdminTag();
const _categoryApi = getCategory();
const _webInfoApi = _getWebInfoApi();

// 获取网站信息（管理后台）
export const getAdminWebInfo = async (): Promise<WebInfoDetail> => {
    const res = await request.get<WebInfoDetail>('/admin/webInfo/get', {}, true);
    return res.data;
};

// 更新网站信息
export const updateWebInfo = async (webInfoData: WebInfoDetail): Promise<WebInfoDetail> => {
    const res = await request.post<WebInfoDetail>('/webInfo/update', webInfoData, true);
    return res.data;
};

// 获取爱情照片列表
export const listAdminLovePhoto = async (webInfoData: any = {}): Promise<LovePhoto[]> => {
    const res = await request.get<LovePhoto[]>('/webInfo/listAdminLovePhoto', webInfoData, true);
    return res.data;
};

// 获取网站信息（前台）
export const getWebInfo = async (): Promise<WebInfoDetail> => {
    const res = await request.get<WebInfoDetail>('/webInfo/get');
    return res.data;
};

// 获取资源路径列表
export const listResourcePath = async (params: ResourcePathListParams): Promise<ResourcePathListResponse> => {
    const res = await request.post<ResourcePathListResponse>('/webInfo/listResourcePath', params);
    return res.data;
};

// 获取历史信息
export const getHistoryInfo = async (): Promise<HistoryInfo> => {
    const res = await request.get<HistoryInfo>('/admin/accessLog/getData', {}, true);
    return res.data;
};

// 获取有趣内容（音乐/搞笑）
export const listFunny = async (params: any = {}): Promise<FunnyContent[]> => {
    const res = await request.get<FunnyContent[]>('/music/listFunny', params);
    return res.data;
};

// 获取收藏内容
export const listCollect = async (params: any = {}): Promise<CollectContent[]> => {
    const res = await request.get<CollectContent[]>('/collect/list', params);
    return res.data;
};

// ===== 分类（Sort）管理 API =====

// 获取分类信息（管理后台分页列表）
export const getSortInfo = async (params?: any): Promise<any> => {
    return _adminCategoryApi.pageList3(params);
};

// 保存分类（新增）
export const saveSort = async (data: CategorySaveReqDTO): Promise<any> => {
    return _adminCategoryApi.save5(data);
};

// 更新分类
export const updateSort = async (data: CategorySaveReqDTO): Promise<any> => {
    if (!data.id) return Promise.reject(new Error('分类ID不能为空'));
    return _adminCategoryApi.update3(data.id, data);
};

// 删除分类
export const deleteSort = async (params: { id: number }): Promise<any> => {
    return _adminCategoryApi.delete5(params.id);
};

// ===== 标签（Label）管理 API =====

// 保存标签（新增）
export const saveLabel = async (data: TagSaveReqDTO): Promise<any> => {
    return _adminTagApi.save2(data);
};

// 更新标签
export const updateLabel = async (data: TagSaveReqDTO): Promise<any> => {
    if (!data.id) return Promise.reject(new Error('标签ID不能为空'));
    return _adminTagApi.update1(data.id, data);
};

// 删除标签
export const deleteLabel = async (params: { id: number }): Promise<any> => {
    return _adminTagApi.delete2(params.id);
};

