/**
 * 系统配置 API 模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */

import request from '@/utils/request.js'

/**
 * 获取系统配置列表
 * @returns {Promise}
 */
export const listSysConfig = () => {
  return request.get('/system/config/list');
};

/**
 * 获取系统配置详情
 * @param {string} configKey - 配置键
 * @returns {Promise}
 */
export const getSysConfig = () => {
  return request.get('/sysConfig/listSysConfig');
};

/**
 * 设置系统配置
 * @param {Object} config - 配置对象
 * @returns {Promise}
 */
export const setSysConfig = (config) => {
  return request.post('/system/config/set', config);
};

/**
 * 删除系统配置
 * @param {string} configKey - 配置键
 * @returns {Promise}
 */
export const deleteSysConfig = (configKey) => {
  return request.delete(`/system/config/${configKey}`);
};
