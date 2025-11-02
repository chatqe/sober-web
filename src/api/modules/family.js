/**
 * 家庭信息模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from "@/utils/request.js";

/**
 * 删除家庭信息的异步函数
 * @param {Object} param - 包含删除家庭所需参数的对象
 * @returns {Promise} - 返回一个Promise，包含请求的结果
 */
export async function deleteFamily(param) {
    return request.get('/admin/family/delete', param, true);
}

/**
 * 获取家庭信息
 * @returns {Promise}
 */
export function getFamily() {
    return request.get('/family/getFamily');
}

/**
 * 获取管理员家庭信息
 * @returns {Promise}
 */
export function getAdminFamily() {
    return request.get('/admin/family/getFamily', {}, true);
}

/**
 * 列表获取所有家庭信息
 * @returns {Promise}
 */
export function listAdminFamily() {
    return request.get('/admin/family/list', {}, true);
}

/**
 * 保存家庭信息
 * @param {Object} family - 家庭信息对象
 * @returns {Promise}
 */
export function saveFamily(family) {
    return request.post('/family/saveFamily', family);
}
