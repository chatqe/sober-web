import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {CategoryStatsVO} from '@/types/modules/categoryStatsVO'
import type {CategoryWebVO} from '@/types/modules/categoryWebVO'
import {categoryApi} from '@/api/modules/category'

interface CategoryState {
    sortInfo: CategoryStatsVO[]
    listNavBar: CategoryWebVO[]
    tags: string[]
}

export const useSortInfoStore = defineStore('sortInfo', () => {

    const sortInfo = ref<CategoryStatsVO[]>([])
    const listNavBar = ref<CategoryWebVO[]>([])
    const tags = ref<string[]>([])

    const articleTotal = computed((): number =>
        sortInfo.value.reduce((prev, curr) => prev + (curr.countOfSort ?? 0), 0)
    )

    const loadHomeStats = async (): Promise<void> => {
        try {
            const res = await categoryApi.homeStats()
            if (res && res.data && res.data.categories) {
                sortInfo.value = res.data.categories
                    .map((c) => ({
                        id: c.id ?? 0,
                        name: c.name ?? '',
                        desc: c.desc,
                        type: c.type,
                        isShow: (c as any).isShow ?? 1,
                        sort: c.sort,
                        icon: c.icon,
                        countOfSort: c.countOfSort ?? 0,
                    }))
                    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
            }
        } catch (e) {
            console.error('[loadHomeStats error]', e)
        }
    }

    const loadListNavBar = async (): Promise<void> => {
        try {
            const res = await categoryApi.listNavBar()
            if (res && res.data) {
                listNavBar.value = res.data
                    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
            }
        } catch (e) {
            console.error('[loadListNavBar error]', e)
        }
    }

    const loadTags = async (): Promise<void> => {
        try {
            const res = await categoryApi.dict()
            if (res && res.data && Array.isArray(res.data)) {
                const allValues = res.data.flatMap((item: any) => Object.values(item).map(String))
                tags.value = [...new Set(allValues)]
            }
        } catch (e) {
            console.error('[loadTags error]', e)
        }
    }

    return {
        sortInfo,
        listNavBar,
        tags,
        articleTotal,
        loadHomeStats,
        loadListNavBar,
        loadTags,
    }
})
