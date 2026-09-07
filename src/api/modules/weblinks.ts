/**
 * 友链资源
 *
 * @author Joy
 * @since 2026-01-03 17:10
 */

import request from '@/utils/request';
import type {
  FriendLinkBase,
  FriendLinkDetail,
  WebInfo,
  SortInfo
} from '../types/weblinks';

import type { ResourcePathListResponse } from '../types/resource';


/**
 * 保存友情链接
 * @param {FriendLinkBase} friend - 友情链接信息
 * @returns {Promise<FriendLinkDetail>}
 */
export async function saveFriend(friend: FriendLinkBase): Promise<FriendLinkDetail> {
    const res = await request.post<FriendLinkDetail>('/weblinks/save', friend);
    return res.data;
}

/**
 * 获取友情链接列表
 * @returns {Promise<FriendLinkDetail[]>}
 */
export async function listFriend(): Promise<FriendLinkDetail[]> {
    const res = await request.get<FriendLinkDetail[]>('/weblinks/list');
    return res.data;
}

/**
 * 保存友情链接（管理员）
 * @param {FriendLinkBase} weblinksVO - 友链信息
 * @returns {Promise<FriendLinkDetail>}
 */
export async function saveWeblinks(weblinksVO: FriendLinkBase): Promise<FriendLinkDetail> {
    const res = await request.post<FriendLinkDetail>('/weblinks/saveWeblinks', weblinksVO);
    return res.data;
}

/**
 * 删除友链
 * @param {id: number} params
 * @returns {Promise<boolean>}
 */
export async function deleteWeblinks(params: {id: number}): Promise<boolean> {
    const res = await request.get<boolean>('/weblinks/deleteWeblinks', params, true);
    return res.data;
}

/**
 * 更新友链
 * @param {FriendLinkBase} weblinksVO - 友链信息
 * @returns {Promise<FriendLinkDetail>}
 */
export async function updateWeblinks(weblinksVO: FriendLinkBase): Promise<FriendLinkDetail> {
    const res = await request.post<FriendLinkDetail>('/weblinks/update', weblinksVO);
    return res.data;
}

/**
 * 获取友链列表（分页）
 * @param {params} params - 分页参数
 * @returns {Promise<ResourcePathListResponse>}
 */
export async function listWeblinks(params: any): Promise<ResourcePathListResponse> {
    const res = await request.post<ResourcePathListResponse>('/weblinks/listWeblinks', params);
    return res.data;
}

/**
 * 获取网站信息
 * @returns {Promise<WebInfo>}
 */
export async function getWebInfo(): Promise<WebInfo> {
    const res = await request.get<WebInfo>('/webInfo/getWebInfo');
    return res.data;
}

/**
 * 获取分类信息
 * @returns {Promise<SortInfo[]>}
 */
export async function getSortInfo(): Promise<SortInfo[]> {
    const res = await request.get<SortInfo[]>('/webInfo/getSortInfo');
    return res.data;
}
