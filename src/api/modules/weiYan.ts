/**
 * 微言模块
 *
 * @author Joy
 * @since 2026-01-03 17:15
 */

import request from '@/utils/request';
import axios from 'axios';
import type {
  WeiYanListParams,
  WeiYanListResponse,
  WeiYanBase,
  WeiYanDetail,
  WeiYanDeleteParams
} from '../types';


// ── 旧版 API（兼容）──────────────────────────────────────────────

// 获取微言列表（旧版，保留兼容）
export const listWeiYan = async (pagination: WeiYanListParams): Promise<WeiYanListResponse> => {
    const res = await request.post<WeiYanListResponse>('/moment/list', pagination);
    return res.data;
};

// 保存微言（旧版）
export const saveWeiYan = async (weiYan: WeiYanBase): Promise<WeiYanDetail> => {
    const res = await request.post<WeiYanDetail>('/moment/save', weiYan);
    return res.data;
};

// 删除微言（旧版）
export const deleteWeiYan = async (id: number): Promise<boolean> => {
    const res = await request.get<boolean>('/moment/del', {id});
    return res.data;
};

// 获取微言新闻列表（旧版）
export const listNews = async (pagination: WeiYanListParams): Promise<WeiYanListResponse> => {
    const res = await request.post<WeiYanListResponse>('/moment/listNews', pagination);
    return res.data;
};

// 保存微言新闻（旧版）
export const saveNews = async (weiYan: WeiYanBase): Promise<WeiYanDetail> => {
    const res = await request.post<WeiYanDetail>('/moment/saveNews', weiYan);
    return res.data;
};


// ── 新版 Timeline API ───────────────────────────────────────────

export interface MomentItem {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string;
  contentSummary: string;
  hasImages?: boolean;
  hasVideos?: boolean;
  hasAudios?: boolean;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  visibility: number;
  source: number;
  liked?: boolean;
  createTime: string;
}

export interface MomentMediaVO {
  id: number;
  fileId: number;
  mediaType: number;
  sortOrder: number;
  url: string;
}

export interface MomentDetailItem extends MomentItem {
  content: string;
  mediaList?: MomentMediaVO[];
  hasText?: boolean;
  updateTime?: string;
}

export interface MomentPageResult {
  list: MomentItem[];
  total: number;
}

const apiBase = import.meta.env.VITE_BASE_URL;

// 公开动态时间线
export const getTimeline = async (params: { pageNum: number; pageSize: number }): Promise<MomentPageResult> => {
  const res = await request.post<MomentPageResult>('/moment/timeline', params);
  return res.data;
};

// 我的动态时间线
export const getMyTimeline = async (params: { pageNum: number; pageSize: number }): Promise<MomentPageResult> => {
  const res = await request.post<MomentPageResult>('/moment/my/timeline', params);
  return res.data;
};

// 发布动态
export const publishMoment = async (data: { content: string; visibility?: number; mediaIds?: number[] }): Promise<number> => {
  const res = await request.post<number>('/moment/publish', data);
  return res.data;
};

// 删除动态
export const deleteMoment = async (id: number): Promise<void> => {
  await axios.delete(`${apiBase}/moment/${id}`, { withCredentials: true });
};

// 点赞
export const likeMoment = async (id: number): Promise<void> => {
  await request.post<void>(`/moment/${id}/like`);
};

// 取消点赞
export const unlikeMoment = async (id: number): Promise<void> => {
  await axios.delete(`${apiBase}/moment/${id}/like`, { withCredentials: true });
};

// 获取评论列表
export const getComments = async (id: number) => {
  const res = await request.get<Array<{
    id: number;
    username: string;
    avatar: string;
    content: string;
    likeCnt: number;
    createTime: string;
  }>>(`/moment/${id}/comments`);
  return res.data;
};

// 发表评论
export const postComment = async (id: number, content: string): Promise<void> => {
  await request.post<void>(`/moment/${id}/comment`, { content });
};
