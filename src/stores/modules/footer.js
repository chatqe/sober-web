import {defineStore} from 'pinia'
import {ref} from 'vue'


export const useFooterStore = defineStore('footer', () => {
        const footerCfg = ref({visible: true, enter: true})

        const setFooterCfg = (footerCfg) => {
            footerCfg.value = footerCfg
        }

        return {
            footerCfg,
            setFooterCfg
        }
    },

    {
        persist: true
    })