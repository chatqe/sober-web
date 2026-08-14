import {defineStore} from 'pinia'
import {ref} from 'vue'

// 定义系统配置接口
interface SysConfig {
  [key: string]: any
}

// 定义State接口
interface SysConfigState {
  sysConfig: SysConfig
}

export const useSysConfigStore = defineStore<SysConfigState>('sysConfig', () => {

        const sysConfig = ref<SysConfig>({})

        const loadSysConfig = (config: SysConfig): void => {
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