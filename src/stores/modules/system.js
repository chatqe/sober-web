import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 系统状态管理
 * 统合工具栏、排序信息、系统配置等全局状态
 */
export const useSystemStore = defineStore('system', () => {
  // 工具栏状态
  const toolbar = ref({
    enter: false,
    visible: true
  })

  // 分类信息
  const sortInfo = ref([])

  // 系统配置
  const sysConfig = ref({})

  // 修改工具栏状态
  const changeToolbarStatus = (status) => {
    toolbar.value = {
      ...toolbar.value,
      ...status
    }
  }

  // 加载分类信息
  const loadSortInfo = (data) => {
    sortInfo.value = data || []
  }

  // 加载系统配置
  const loadSysConfig = (config) => {
    sysConfig.value = config || {}
  }

  return {
    toolbar,
    sortInfo,
    sysConfig,
    changeToolbarStatus,
    loadSortInfo,
    loadSysConfig
  }
}, {
  persist: true
})
