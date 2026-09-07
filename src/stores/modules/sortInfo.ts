import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

// 定义标签接口
interface Tag {
    name: string
}

// 定义分类项接口
interface CategoryItem {
    id?: number
    sortType: number
    countOfSort: number
    priority: number
    tags?: Tag[]

    [key: string]: any
}

// 定义State接口
interface SortInfoState {
    sortInfo: CategoryItem[]
    tags: string[]
}

// 在pinia中定义的ref()响应式数据 在别的地方不需要.value来进行获取,因为底层的state就是使用reactive
export const useSortInfoStore = defineStore<SortInfoState>('sortInfo', () => {

        const sortInfo = ref<CategoryItem[]>([])
        // 标签云
        const tags = ref<string[]>([])

        const articleTotal = computed((): number => {
            if (sortInfo.value && sortInfo.value.length !== 0) {
                return sortInfo.value.reduce((prev: number, curr: CategoryItem): number => {
                    return prev + (curr.countOfSort || 0)
                }, 0)
            } else {
                return 0
            }
        })

        const navigationBar = computed((): CategoryItem[] => {
            if (sortInfo.value && sortInfo.value.length !== 0) {
                return sortInfo.value.filter((f: CategoryItem) => f.sortType === 0)
            } else {
                return []
            }
        })

        const loadSortInfo = (sortInfoData: CategoryItem[]): void => {
            if (sortInfoData && sortInfoData.length !== 0) {
                sortInfo.value = sortInfoData.sort((s1: CategoryItem, s2: CategoryItem) => s1.priority - s2.priority)
                tags.value = [
                    ...new Set(
                        sortInfoData
                            .filter((item: CategoryItem) => Array.isArray(item.tags))
                            .flatMap((item: CategoryItem) => item.tags!.map((t: Tag) => t.name))
                    )
                ]
            }
        }

        /**
         * 加载首页统计数据（来自 /webInfo/homeStats）
         * 将 HomeStatsVO.categories 转换为 CategoryItem[] 存入 store
         */
        const loadHomeStats = (categories: import('@/api/modules/home').HomeStatsCategory[]): void => {
            if (!categories || categories.length === 0) {
                sortInfo.value = []
                return
            }
            // type -> sortType, sort -> priority, 保留 countOfSort
            const items: CategoryItem[] = categories.map(c => ({
                id: c.id,
                sortType: c.type ?? 1,
                countOfSort: c.countOfSort ?? 0,
                priority: c.sort ?? 0,
                name: c.name,
                description: c.desc,
                status: 1,
            }))
            sortInfo.value = items.sort((a, b) => a.priority - b.priority)
            tags.value = []
        }

        return {
            sortInfo,
            tags,
            articleTotal,
            navigationBar,
            loadSortInfo,
            loadHomeStats
        }
    },

    {
        persist: true
    })