import {defineStore} from 'pinia'
import {ref} from 'vue'

// 定义State接口
interface FooterState {
  footerCfg: { visible: boolean; enter: boolean }
}

export const useFooterStore = defineStore('footer', () => {
        const footerCfg = ref<{ visible: boolean; enter: boolean }>({visible: true, enter: true})

        const setFooterCfg = (newFooterCfg: { visible: boolean; enter: boolean }) => {
            footerCfg.value = newFooterCfg
        }

        return {
            footerCfg,
            setFooterCfg
        }
})
