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
  TreeHoleBase,
  TreeHoleDetail,
  FunnyContent,
  CollectContent
} from '../types';


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
    const res = await request.get<HistoryInfo>('/admin/accessLog/getData');
    return res.data;
};

// 获取最新树洞
export const listTreeHole = async (): Promise<TreeHoleDetail[]> => {
    const res = await request.get<TreeHoleDetail[]>('/treeHole/list');
    return res.data;
};

// 添加树洞
export const saveTreeHole = async (params: TreeHoleBase): Promise<TreeHoleDetail> => {
    const res = await request.post<TreeHoleDetail>('/treeHole/save', params);
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
