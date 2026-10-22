/**
 * 标签管理 API 模块
 */

import { getAdminTag } from '../generated/admin-tag'
import { getTag } from '../generated/tag'
import type { TagSaveReqDTO } from '../../types/modules/tagSaveReqDTO'

const adminTag = getAdminTag()

/**
 * 公开标签列表（匿名可访问，GET /tag/list）
 * 注意：后端 TagWebVO 不返回文章数，articleCount 恒为空
 */
export const listPublicTag = (categoryId?: number) =>
  getTag().list4(categoryId === undefined || categoryId === null ? undefined : { categoryId })

export const tagApi = {
  getPage: (params?: { categoryId?: number; keyword?: string; pageNum?: number; pageSize?: number }) =>
    adminTag.pageList1(params),
  save: (dto: TagSaveReqDTO) => adminTag.save3(dto),
  update: (id: number, dto: TagSaveReqDTO) => adminTag.update1(id, dto),
  delete: (id: number) => adminTag.delete3(id),
}
