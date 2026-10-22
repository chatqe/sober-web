/**
 * 家庭信息（表白墙）模块
 *
 * 后端已在 Family 模块重构中移除 /family/* 系列端点，改为：
 * - 公开端：FamilyWebController  /api/families/list、/api/families/{id}
 * - 登录端：AdminFamilyController /admin/families/*（@LoginCheck 仅要求登录，不要求管理员）
 *
 * @author sjq
 * @since 2025-10-29 19:30
 */
import { handleResponse } from '../client/responseHandler';
import { getFamily as getFamilyGenerated } from '../generated/family';
import { getAdminFamily as getAdminFamilyGenerated } from '../generated/admin-family';
import { useAuthStore } from '@/stores/modules/auth';
import type { RPageResultFamilyListVO } from '@/types/modules/rPageResultFamilyListVO';
import type { FamilyBase, FamilyDeleteParams } from '../types';

const publicFamilyApi = getFamilyGenerated();
const adminFamilyApi = getAdminFamilyGenerated();

/** 站点所有者（站长）的用户 ID，与 utils/constant.ts 的 $constant.userId 保持一致 */
const OWNER_USER_ID = 1;

/** 一次拉取的最大条数，用于在前端按 userId 匹配自己的卡片（分页接口不支持 userId 过滤） */
const MAX_PAGE_SIZE = 200;

/**
 * 是否已登录：/admin/families/* 未登录会返回 300，responseHandler 会直接跳转登录页，
 * 因此未登录时必须跳过管理端请求
 */
const isLogin = (): boolean => {
  const authStore = useAuthStore();
  return Boolean(authStore.userToken || authStore.adminToken);
};

/**
 * 公开列表：只返回启用中的卡片
 * @param {number} size - 返回条数
 */
export async function listRandomFamily(size: number = MAX_PAGE_SIZE): Promise<FamilyBase[]> {
  const list = await publicFamilyApi.list6({size});
  return list || [];
}

/**
 * 公开详情：仅启用中的卡片，字段较管理端详情少（无头像、倒计时）
 * @param {number} id - 卡片 ID
 */
export async function getPublicFamily(id: number): Promise<FamilyBase> {
  return publicFamilyApi.getDetail1(id);
}

/**
 * 管理端分页查询（登录即可访问）
 * Orval 生成的 PageList2Params 把参数包成了 { query: {...} }，后端按扁平参数绑定，故此处手写传参
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.status 启用状态：1-启用 0-禁用，不传为全部
 */
export async function listFamily(
  params: {pageNum?: number; pageSize?: number; status?: number | null} = {}
): Promise<any> {
  const query: Record<string, any> = {
    pageNum: params.pageNum ?? 1,
    pageSize: params.pageSize ?? 10
  };
  if (params.status !== null && params.status !== undefined) {
    query.status = params.status;
  }
  const data = await handleResponse<RPageResultFamilyListVO>({
    url: '/admin/families/page',
    method: 'GET',
    params: query
  });
  return data || {list: [], total: 0};
}

/**
 * 管理端详情：返回封面、倒计时等完整字段
 * @param {number} id - 卡片 ID
 */
export async function getFamilyDetail(id: number): Promise<FamilyBase> {
  return adminFamilyApi.getDetail3(id);
}

/**
 * 按用户查卡片：先取回列表按 userId 匹配，再取详情
 * @param {number} userId - 用户 ID
 * @returns 未登录或该用户没有卡片时返回 null
 */
export async function getFamilyByUserId(userId: number): Promise<FamilyBase | null> {
  if (!isLogin()) {
    return null;
  }
  const page = await listFamily({pageNum: 1, pageSize: MAX_PAGE_SIZE});
  const mine = (page.list || []).find((item: FamilyBase) => String(item.userId) === String(userId));
  return mine && mine.id ? getFamilyDetail(mine.id) : null;
}

/**
 * 获取当前用户的家庭卡片（用于回填编辑表单）
 * @param {number} userId - 用户 ID，缺省为站长
 */
export async function getFamily(userId?: number): Promise<FamilyBase | null> {
  return getFamilyByUserId(userId ?? OWNER_USER_ID);
}

/**
 * 获取站长（主人）的家庭卡片
 * 已登录时走管理端详情（字段完整）；未登录时退回公开列表首条，保证匿名访问也能渲染
 */
export async function getAdminFamily(): Promise<FamilyBase | null> {
  if (isLogin()) {
    try {
      const owner = await getFamilyByUserId(OWNER_USER_ID);
      if (owner) {
        return owner;
      }
    } catch (error) {
      // 站长的卡片可能不存在，继续走公开兜底
    }
  }
  const list = await listRandomFamily(MAX_PAGE_SIZE);
  if (!list.length || !list[0].id) {
    return null;
  }
  return getPublicFamily(list[0].id);
}

/**
 * 保存家庭信息：后端按当前登录用户 upsert，传 id 时为更新
 * @param {FamilyBase} family - 家庭信息对象
 */
export async function saveFamily(family: FamilyBase): Promise<any> {
  return adminFamilyApi.save5(family);
}

/**
 * 删除家庭信息
 * @param {FamilyDeleteParams} param - 包含 id 的删除参数
 */
export async function deleteFamily(param: FamilyDeleteParams): Promise<any> {
  return adminFamilyApi.delete5(param.id);
}

/**
 * 切换启用状态：后端是 toggle 语义，入参中的 flag 仅用于兼容旧调用
 * @param params.id 卡片 ID
 */
export async function changeLoveStatus(params: {id: number, flag?: boolean}): Promise<any> {
  return adminFamilyApi.toggleStatus(params.id);
}
