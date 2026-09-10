import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

// 定义标签接口
interface Label {
  labelName: string
}

// 定义分类项接口
interface SortItem {
  id?: number
  sortType: number
  countOfSort: number
  priority: number
  labels?: Label[]
  [key: string]: any
}

// 定义State接口
interface SortInfoState {
  sortInfo: SortItem[]
  labels: string[]
}

// 在pinia中定义的ref()响应式数据 在别的地方不需要.value来进行获取,因为底层的state就是使用reactive
export const useSortInfoStore = defineStore<SortInfoState>('sortInfo', () => {

        const sortInfo = ref<SortItem[]>([])
        // 标签云
        const labels = ref<string[]>([])

        const articleTotal = computed((): number => {
            if (sortInfo.value && sortInfo.value.length !== 0) {
                if (sortInfo.value.length === 1) {
                    return sortInfo.value[0].countOfSort
                } else {
                    return sortInfo.value.reduce((prev: number | SortItem, curr: SortItem): number => {
                        if (typeof prev === "number") {
                            return prev + curr.countOfSort
                        } else {
                            return prev.countOfSort + curr.countOfSort
                        }
                    }, 0)
                }
            } else {
                return 0
            }
        })

        const navigationBar = computed((): SortItem[] => {
            if (sortInfo.value && sortInfo.value.length !== 0) {
                return sortInfo.value.filter((f: SortItem) => f.sortType === 0)
            } else {
                return []
            }
        })

        const loadSortInfo = (sortInfoData: SortItem[]): void => {
            if (sortInfoData && sortInfoData.length !== 0) {
                sortInfo.value = sortInfoData.sort((s1: SortItem, s2: SortItem) => s1.priority - s2.priority)
                labels.value = [
                    ...new Set(
                        sortInfoData
                            .filter((item: SortItem) => Array.isArray(item.labels))
                            .flatMap((item: SortItem) => item.labels!.map((l: Label) => l.labelName))
                    )
                ]
            }
        }

        return {
            sortInfo,
            labels,
            articleTotal,
            navigationBar,
            loadSortInfo
        }
    },

    {
        persist: true
    })