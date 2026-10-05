/**
 * API 入口文件
 *
 * 重新导出各业务模块的 API，供组件通过 @/api/index.js 导入使用。
 *
 * @author Joy
 * @since 2026-08-15
 *
 * API 路径约定：
 * - Path A（手写 modules/*.ts 用 request.get/post）：response interceptor 已解包，
 *   返回值即业务类型 T，直接访问 res.xxx，不需要 res.data。
 * - Path B（Orval 生成代码，通过 responseHandler.ts handleResponse）：
 *   已同步解包，返回 R*VO 时剥除信封，直接返回 T。
 *   注意：R 类型中不含 data 字段的（如 boolean、string）保持原样。
 *   消费者一律直接访问 res.xxx，不要写 res.data。
 */
export * from './modules/index';
