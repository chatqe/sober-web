import {defineStore} from 'pinia'
import {computed, ref} from 'vue'


// 在pinia中定义的ref()响应式数据 在别的地方不需要.value来进行获取,因为底层的state就是使用reactive
export const useSortInfoStore = defineStore('sortInfo', () => {

        const sortInfo = ref([])
        // 标签云
        const labels = ref([])

        const articleTotal = computed(() => {
            if (sortInfo.value && sortInfo.value.length !== 0) {
                if (sortInfo.value.length === 1) {
                    return sortInfo.value[0].countOfSort
                } else {
                    return sortInfo.value.reduce((prev, curr) => {
                        if (typeof prev === "number") {
                            return prev + curr.countOfSort
                        } else {
                            return prev.countOfSort + curr.countOfSort
                        }
                    })
                }
            } else {
                return 0
            }
        })

        const navigationBar = computed(() => {
            if (sortInfo.value && sortInfo.value.length !== 0) {
                return sortInfo.value.filter(f => f.sortType === 0)
            } else {
                return []
            }
        })

        const loadSortInfo = (sortInfoData) => {
            if (sortInfoData && sortInfoData.length !== 0) {
                sortInfo.value = sortInfoData.sort((s1, s2) => s1.priority - s2.priority)
                labels.value = [
                    ...new Set(
                        sortInfoData
                            .filter(item => Array.isArray(item.labels))
                            .flatMap(item => item.labels.map(l => l.labelName))
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