/**
 * 系统配置模块
 *
 * 封装 orval 生成的 sys-config API，提供 systemApi 命名空间供组件使用。
 *
 * @author Joy
 * @since 2026-08-15
 */

import { getSysConfig as createSysConfigApi } from '../generated/sys-config';

// 初始化 orval 生成的 API 工厂
const api = createSysConfigApi();

/**
 * 系统配置 API
 * 提供系统配置的查询、保存、删除等功能
 */
export const systemApi = {
  /** 获取系统公共配置（返回 Map<String, String>） */
  getSysConfig: api.listSysConfig,
  /** 查询系统公共配置参数 */
  listSysConfig: api.listSysConfig,
  /** 查询所有系统配置（包括公共和私有） */
  listConfig: api.listConfig,
  /** 保存或更新系统配置 */
  saveConfig: api.saveConfig,
  /** 删除指定 ID 的系统配置 */
  deleteConfig: api.deleteConfig,
};
