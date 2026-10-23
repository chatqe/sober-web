import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {CategoryWebVO} from '@/types/modules/categoryWebVO'
import {categoryApi} from '@/api/modules/category'

interface CategoryState {
    sortInfo: CategoryWebVO[]
    listNavBar: CategoryWebVO[]
    tags: string[]
}

export const useSortInfoStore = defineStore('sortInfo', () => {

    const sortInfo = ref<CategoryWebVO[]>([])
    const listNavBar = ref<CategoryWebVO[]>([])
    const tags = ref<string[]>([])

    const loadCategories = async (): Promise<void> => {
        try {
            const res = await categoryApi.listCategories()
            if (res) {
                // 后端已按 sort 升序并完成过滤，直接使用
                sortInfo.value = res
            }
        } catch (e) {
            console.error('[loadCategories error]', e)
        }
    }

    const loadListNavBar = async (): Promise<void> => {
        try {
            const res = await categoryApi.listNavBar()
            if (res) {
                // 后端已按 sort 升序并完成过滤，直接使用
                listNavBar.value = res
            }
        } catch (e) {
            console.error('[loadListNavBar error]', e)
        }
    }

    const loadTags = async (): Promise<void> => {
        try {
            const res = await categoryApi.dict()
            if (res && Array.isArray(res)) {
                const allValues = res.flatMap((item: any) => Object.values(item).map(String))
                tags.value = [...new Set(allValues.map(v => String(v)))]
            }
        } catch (e) {
            console.error('[loadTags error]', e)
        }
    }

    return {
        sortInfo,
        listNavBar,
        tags,
        loadCategories,
        loadListNavBar,
        loadTags,
    }
})
