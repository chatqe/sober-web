/**
 * 网站信息模块
 *
 * @author sjq
 * @since 2025-10-28 19:25
 */

import request from '@/utils/request.js';

// 获取网站信息（管理后台）
export const getAdminWebInfo = () => {
    return request.get('/admin/webInfo/getAdminWebInfo', {}, true);
};

// 更新网站信息
export const updateWebInfo = (webInfoData) => {
    return request.post('/webInfo/updateWebInfo', webInfoData, true);
};
export const listAdminLovePhoto = (webInfoData) => {
    return request.get('/webInfo/listAdminLovePhoto', webInfoData, true);
};

// 获取网站信息（前台）
export const getWebInfo = () => {
    return request.get('/webInfo/getWebInfo');
};

// 获取资源路径列表
export const listResourcePath = (params) => {
    return request.post('/webInfo/listResourcePath', params);
};

// 获取历史信息
export const getHistoryInfo = () => {
    return request.get('/webInfo/getHistoryInfo');
};

// 获取最新树洞
export const listTreeHole = () => {
    return request.get('/webInfo/listTreeHole')
};

// 添加树洞
export const saveTreeHole = (params) => {
    return request.post('/webInfo/saveTreeHole', params);
};

export const listFunny = (params) => {
    return request.get('/webInfo/listFunny');
};export const listCollect = (params) => {
    return request.get('/webInfo/listCollect');
};
