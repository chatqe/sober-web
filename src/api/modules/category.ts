import {getCategory} from '../generated/category'
import {getTag} from '../generated/tag'
import type {SortAndLabelResponse, CategoryInfo, TagInfo} from '../types'
import type {CategoryWebVO} from '@/types/modules/categoryWebVO'
import request from '@/utils/request'

const _categoryApi = getCategory()
const _tagApi = getTag()

/**
 * 获取公开分类列表（启用且展示，含导航栏与普通分类）
 */
export const listCategories = async (): Promise<CategoryWebVO[]> => {
    const res = await request.get<CategoryWebVO[]>('/category/list')
    return res.data ?? []
}
// dict
export const dict = () => _categoryApi.dict1()
// subscribe
export const subscribeCategory = (params: import('../../types/modules/subscribe1Params').Subscribe1Params) => _categoryApi.subscribe1(params)
// listNavBar
export const listNavBar = () => _categoryApi.listNavBar()

/**
 * 获取分类和标签列表
 * @returns {Promise<SortAndLabelResponse>} 分类和标签列表
 */
export const getSortAndLabel = async (): Promise<SortAndLabelResponse> => {
    const [sortRes, labelRes] = await Promise.all([
        _categoryApi.dict1(),
        _tagApi.dict()
    ]);
    const sorts: CategoryInfo[] = (sortRes || []).map((item: any) => ({
        id: Number(item.value),
        name: item.label
    }));
    const labels: TagInfo[] = (labelRes || []).map((item: any) => ({
        id: Number(item.value),
        name: item.label,
        categoryId: item.cateId
    }));
    return { sorts, labels };
}

export const categoryApi = {
    listCategories,
    dict,
    subscribe: subscribeCategory,
    listNavBar,
    getSortAndLabel,
}
