/**
 * 微言模块API
 */

import request from '@/utils/request.js';

// 获取微言列表
export const listWeiYan = (pagination) => {
    return request.post('/weiYan/listWeiYan', pagination);
};

// 保存微言
export const saveWeiYan = (weiYan) => {
    return request.post('/weiYan/saveWeiYan', weiYan);
};

// 删除微言
export const deleteWeiYan = (id) => {
    return request.get('/weiYan/deleteWeiYan', {id});
};