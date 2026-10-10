/**
 * 标签管理 API 模块
 */

import { getAdminTag } from '../generated/admin-tag'
import type { TagSaveReqDTO } from '../../types/modules/tagSaveReqDTO'

const adminTag = getAdminTag()

export const tagApi = {
  getPage: (params?: { categoryId?: number; keyword?: string; pageNum?: number; pageSize?: number }) =>
    adminTag.pageList1(params),
  save: (dto: TagSaveReqDTO) => adminTag.save2(dto),
  update: (id: number, dto: TagSaveReqDTO) => adminTag.update1(id, dto),
  delete: (id: number) => adminTag.delete2(id),
}
