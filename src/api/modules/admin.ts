/**
 * 后台管理 API 模块（分类、标签）
 *
 * @author Joy
 * @since 2026-09-10
 */

import { getAdminCategory } from '../generated/admin-category';
import { getAdminTag } from '../generated/admin-tag';
import { getCategory } from '../generated/category';
import { getTag } from '../generated/tag';
import type { CategorySaveReqDTO } from '../../types/modules/categorySaveReqDTO';
import type { TagSaveReqDTO } from '../../types/modules/tagSaveReqDTO';

const adminCategory = getAdminCategory();
const adminTag = getAdminTag();
const webCategory = getCategory();
const webTag = getTag();

export const adminApi = {
  // 分类 CRUD
  getCategoryPage: (params?: { keyword?: string; type?: number; status?: number; pageNum?: number; pageSize?: number }) =>
    adminCategory.pageList3(params),
  getCategoryDetail: (id: number) => adminCategory.getDetail4(id),
  getCategoryDict: () => webCategory.dict1(),
  saveCategory: (dto: CategorySaveReqDTO) => adminCategory.save5(dto),
  updateCategory: (id: number, dto: CategorySaveReqDTO) => adminCategory.update3(id, dto),
  deleteCategory: (id: number) => adminCategory.delete5(id),

  // 标签 CRUD
  getTagPage: (params?: { categoryId?: number; keyword?: string; pageNum?: number; pageSize?: number }) =>
    adminTag.pageList1(params),
  getTagDetail: (id: number) => adminTag.getDetail2(id),
  getTagDict: () => webTag.dict(),
  saveTag: (dto: TagSaveReqDTO) => adminTag.save2(dto),
  updateTag: (id: number, dto: TagSaveReqDTO) => adminTag.update1(id, dto),
  deleteTag: (id: number) => adminTag.delete2(id),
};
