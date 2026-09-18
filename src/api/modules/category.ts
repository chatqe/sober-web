import {getCategory} from '../generated/category'

const _categoryApi = getCategory()

// homeStats
export const homeStats = () => _categoryApi.homeStats()
// dict
export const dict = () => _categoryApi.dict1()
// subscribe
export const subscribeCategory = (params: import('../../types/modules/subscribe1Params').Subscribe1Params) => _categoryApi.subscribe1(params)
// listNavBar
export const listNavBar = () => _categoryApi.listNavBar()

export const categoryApi = {
    homeStats,
    dict,
    subscribe: subscribeCategory,
    listNavBar,
}
