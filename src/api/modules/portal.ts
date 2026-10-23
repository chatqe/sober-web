/**
 * 门户聚合 API 模块
 *
 * 首页侧边栏站点概览统计，后端：GET /portal/overview
 *
 * @author Joy
 * @since 2026-10-23
 */

import request from '@/utils/request';

export interface PortalOverview {
    webName?: string;
    webTitle?: string;
    avatar?: string;
    articleTotal?: number;
    categoryTotal?: number;
    historyAllCount?: number;
    viewTotal?: number;
    likeTotal?: number;
}

/**
 * 获取站点概览统计
 */
export const getPortalOverview = async (): Promise<PortalOverview> => {
    const res = await request.get<PortalOverview>('/portal/overview');
    return res.data;
};

export const portalApi = {
    getOverview: getPortalOverview,
};
