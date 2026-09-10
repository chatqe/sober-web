/**
 * 微言模块
 *
 * @author Joy
 * @since 2026-01-03 17:15
 */

import request from '@/utils/request';
import type {
  WeiYanListParams,
  WeiYanListResponse,
  WeiYanBase,
  WeiYanDetail,
  WeiYanDeleteParams
} from '../types';


// 获取微言列表
export const listWeiYan = async (pagination: WeiYanListParams): Promise<WeiYanListResponse> => {
    const res = await request.post<WeiYanListResponse>('/moment/list', pagination);
    return res.data;
};

// 保存微言
export const saveWeiYan = async (weiYan: WeiYanBase): Promise<WeiYanDetail> => {
    const res = await request.post<WeiYanDetail>('/moment/save', weiYan);
    return res.data;
};

// 删除微言
export const deleteWeiYan = async (id: number): Promise<boolean> => {
    const res = await request.get<boolean>('/moment/del', {id});
    return res.data;
};

// 获取微言新闻列表
export const listNews = async (pagination: WeiYanListParams): Promise<WeiYanListResponse> => {
    const res = await request.post<WeiYanListResponse>('/moment/listNews', pagination);
    return res.data;
};

// 保存微言新闻
export const saveNews = async (weiYan: WeiYanBase): Promise<WeiYanDetail> => {
    const res = await request.post<WeiYanDetail>('/moment/saveNews', weiYan);
    return res.data;
};
