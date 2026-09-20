import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface RouteTab {
  path: string
  title: string
  name?: string
}

const ROUTE_TITLE_MAP: Record<string, string> = {
  '/admin/main': '工作台',
  '/admin/welcome': '欢迎页',
  '/admin/webEdit': '网站设置',
  '/admin/userList': '用户管理',
  '/admin/postList': '文章列表',
  '/admin/postEdit': '文章编辑',
  '/admin/categoryList': '分类管理',
  '/admin/commentList': '评论管理',
  '/admin/treeHoleList': '弹幕管理',
  '/admin/resourceList': '资源管理',
  '/admin/resourcePathList': '资源聚合',
  '/admin/loveList': '表白墙',
}

export const useAdminTabsStore = defineStore('adminTabs', () => {
  const tabs = ref<RouteTab[]>([])
  const activePath = ref('/admin/main')
  const openPaths = ref<Set<string>>(new Set(['/admin/main']))

  const getTabTitle = (path: string): string => {
    return ROUTE_TITLE_MAP[path] || path.split('/').pop() || '页面'
  }

  // 根据当前路由初始化 tabs（在 router ready 后调用一次）
  const initFromRoute = (route: RouteLocationNormalized): void => {
    const existing = tabs.value.find(t => t.path === route.path)
    if (!existing) {
      tabs.value.push({
        path: route.path,
        title: getTabTitle(route.path),
        name: route.name as string | undefined,
      })
    }
    openPaths.value.add(route.path)
    activePath.value = route.path
  }

  const addTab = (route: RouteLocationNormalized): void => {
    const path = route.path
    if (!openPaths.value.has(path)) {
      openPaths.value.add(path)
      tabs.value.push({
        path,
        title: getTabTitle(path),
        name: route.name as string | undefined,
      })
    } else if (path === '/admin/main' && !tabs.value.some(t => t.path === path)) {
      // /admin/main 始终保持在 tabs 中
      tabs.value.unshift({ path, title: getTabTitle(path) })
    }
    activePath.value = path
  }

  const closeTab = (path: string): void => {
    if (path === '/admin/main') return
    const idx = tabs.value.findIndex(t => t.path === path)
    if (idx === -1) return
    tabs.value.splice(idx, 1)
    openPaths.value.delete(path)
    if (activePath.value === path) {
      const next = tabs.value[Math.min(idx, tabs.value.length - 1)]
      if (next) setActive(next.path)
    }
  }

  const closeOthers = (path: string): void => {
    const kept = tabs.value.filter(t => t.path === path)
    tabs.value = kept
    openPaths.value = new Set([path])
    activePath.value = path
  }

  const closeAll = (): void => {
    const home = tabs.value.find(t => t.path === '/admin/main') || { path: '/admin/main', title: '工作台' }
    tabs.value = [home]
    openPaths.value = new Set(['/admin/main'])
    activePath.value = '/admin/main'
  }

  const setActive = (path: string): void => {
    activePath.value = path
  }

  return { tabs, activePath, initFromRoute, addTab, closeTab, closeOthers, closeAll, setActive }
})
