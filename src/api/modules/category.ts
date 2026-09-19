import {getCategory} from '../generated/category'
import {getTag} from '../generated/tag'
import type {SortAndLabelResponse, CategoryInfo, TagInfo} from '../types'

const _categoryApi = getCategory()
const _tagApi = getTag()

// homeStats
export const homeStats = () => _categoryApi.homeStats()
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
    const sorts: CategoryInfo[] = (sortRes.data || []).map((item: any) => ({
        id: Number(item.value),
        name: item.label
    }));
    const labels: TagInfo[] = (labelRes.data || []).map((item: any) => ({
        id: Number(item.value),
        name: item.label,
        categoryId: item.cateId
    }));
    return { sorts, labels };
}

export const categoryApi = {
    homeStats,
    dict,
    subscribe: subscribeCategory,
    listNavBar,
    getSortAndLabel,
}
