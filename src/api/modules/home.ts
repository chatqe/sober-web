/**
 * 首页 API 模块
 *
 * 整合首页所需的网站信息和分类统计接口。
 *
 * @author Joy
 * @since 2026-09-10
 */

import { getWebInfo as createWebInfoApi } from '../generated/web-info';
import request from '@/utils/request';

const webInfoApi = createWebInfoApi();

/**
 * 首页分类统计（来自 /api/categories/homeStats）
 */
export interface CategoryStatsVO {
    id?: number;
    name?: string;
    desc?: string;
    type?: number;
    sort?: number;
    icon?: string;
    countOfSort?: number;
    [key: string]: any;
}

export interface HomeStatsResponse {
    articleTotal?: number;
    categoryTotal?: number;
    categories?: CategoryStatsVO[];
    [key: string]: any;
}

/**
 * 获取首页统计数据
 * 后端：GET /api/categories/homeStats
 */
export const getHomeStats = async (): Promise<HomeStatsResponse> => {
    const res = await request.get<HomeStatsResponse>('/category/homeStats');
    return res;
};

export const homeApi = {
    /** 获取网站基本信息（来自 orval 生成层，已剥离 R<T> 信封） */
    getWebInfo: webInfoApi.getWebInfo,
    /** 获取首页分类统计（含文章计数） */
    getHomeStats,
};
