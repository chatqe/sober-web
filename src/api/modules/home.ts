/**
 * 首页 API 模块
 *
 * 整合首页所需的网站信息接口。
 *
 * @author Joy
 * @since 2026-09-10
 */

import { getWebInfo as createWebInfoApi } from '../generated/web-info';

const webInfoApi = createWebInfoApi();

export const homeApi = {
    /** 获取网站基本信息（来自 orval 生成层，已剥离 R<T> 信封） */
    getWebInfo: webInfoApi.getWebInfo,
};
