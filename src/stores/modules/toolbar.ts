import {defineStore} from 'pinia'
import {ref} from 'vue'

// 定义State接口
interface ToolbarState {
  toolbar: { visible: boolean; enter: boolean }
}

export const useToolbarStore = defineStore('toolbar', () => {
        const toolbar = ref<{ visible: boolean; enter: boolean }>({visible: false, enter: true})

        const changeToolbarStatus = (toolbarState: { visible: boolean; enter: boolean }) => {
            toolbar.value = toolbarState
        }

        return {
            toolbar,
            changeToolbarStatus
        }
})
