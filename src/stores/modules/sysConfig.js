import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useSysConfigStore = defineStore('sysConfig', () => {

        const sysConfig = ref( {})

        const loadSysConfig = (config) => {
            sysConfig.value = config
        }

        return {
            sysConfig,
            loadSysConfig
        }
    },

    {
        persist: true
    })