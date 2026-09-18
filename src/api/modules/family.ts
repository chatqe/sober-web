/**
 * 家庭信息模块
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import request from "@/utils/request";
import type {
  FamilyDetail,
  FamilyListResponse,
  FamilyDeleteParams,
  FamilyBase
} from '../types';
import { getAdminFamily as _getAdminFamily } from '../generated/admin-family';
import type { PageList2Params } from '@/types/modules/pageList2Params';

const adminFamilyApi = _getAdminFamily();

/**
 * 删除家庭信息
 * @param {FamilyDeleteParams} param - 包含删除家庭所需参数的对象
 * @returns {Promise<boolean>} - 返回一个Promise，包含请求的结果
 */
export async function deleteFamily(param: FamilyDeleteParams): Promise<boolean> {
    const res = await request.get<boolean>('/family/deleteFamily', param, true);
    return res.data;
}

/**
 * 获取家庭信息
 * @returns {Promise<FamilyDetail>}
 */
export async function getFamily(): Promise<FamilyDetail> {
    const res = await request.get<FamilyDetail>('/family/getFamily');
    return res.data;
}

/**
 * 获取管理员家庭信息
 * @returns {Promise<FamilyDetail>}
 */
export async function getAdminFamilyInfo(): Promise<FamilyDetail> {
    const res = await request.get<FamilyDetail>('/family/getAdminFamily', {}, false);
    return res.data;
}

/**
 * 列表获取所有家庭信息
 * @returns {Promise<FamilyListResponse>}
 */
export async function listRandomFamily(): Promise<FamilyListResponse> {
    const res = await request.get<FamilyListResponse>('/family/listRandomFamily', {}, true);
    return res.data;
}

/**
 * 保存家庭信息
 * @param {FamilyBase} family - 家庭信息对象
 * @returns {Promise<FamilyDetail>}
 */
export async function saveFamily(family: FamilyBase): Promise<FamilyDetail> {
    const res = await request.post<FamilyDetail>('/family/saveFamily', family);
    return res.data;
}

/**
 * 修改爱情状态
 * @param {id: number, flag: boolean} params - 参数
 * @returns {Promise<boolean>}
 */
export async function changeLoveStatus(params: {id: number, flag: boolean}): Promise<boolean> {
    const res = await request.get<boolean>('/family/changeLoveStatus', params, true);
    return res.data;
}

// ===== 管理后台家庭 API =====

// 分页查询家庭列表
export const listFamily = async (params: PageList2Params): Promise<any> => {
    const res = await request.get<any>('/admin/families/page', params, true);
    return res.data;
};

// 获取管理员家庭信息（别名，兼容组件调用）
export const getAdminFamily = async (): Promise<FamilyDetail> => {
    return getAdminFamilyInfo();
};
