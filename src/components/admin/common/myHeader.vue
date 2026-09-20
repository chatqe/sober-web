<template>
  <div class="my-header">
    <div class="header-left">
      <div class="icon-group">
        <el-tooltip content="侧边栏" placement="bottom" :show-timeout="200">
          <div class="icon-btn" @click="toggleSidebar"><el-icon><Menu /></el-icon></div>
        </el-tooltip>
        <el-tooltip content="刷新" placement="bottom" :show-timeout="200">
          <div class="icon-btn" @click="handleRefresh"><el-icon><Refresh /></el-icon></div>
        </el-tooltip>
        <el-tooltip content="工作台" placement="bottom" :show-timeout="200">
          <div class="icon-btn" @click="router.push('/admin/main')"><el-icon><Monitor /></el-icon></div>
        </el-tooltip>
      </div>
      <div class="breadcrumb">
        <span class="crumb-item">仪表盘</span>
        <span class="crumb-sep">/</span>
        <span class="crumb-current">{{ currentTabTitle }}</span>
      </div>
    </div>
    <div class="header-right">
      <div class="home-btn" @click="router.push('/')">
        <el-icon><House /></el-icon>
      </div>
      <el-button circle><el-icon><Bell /></el-icon></el-button>
      <el-button circle @click="toggleFullscreen"><el-icon><FullScreen /></el-icon></el-button>
      <el-button circle><el-icon><Moon /></el-icon></el-button>
      <el-divider direction="vertical" class="header-divider" />
      <el-dropdown placement="bottom" :show-timeout="100" :hide-timeout="150">
        <div class="user-badge">
          <el-avatar :size="28" :src="currentAdmin.avatar" class="user-badge-avatar">{{ currentAdmin.username?.[0] || 'U' }}</el-avatar>
          <span class="user-badge-name">{{ currentAdmin.username || '管理员' }}</span>
          <el-icon class="user-arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, useUserStore, useAdminTabsStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { House, ArrowDown, SwitchButton, Bell, FullScreen, Moon, Menu, Refresh, Monitor } from '@element-plus/icons-vue'
import { authApi } from '@/api/index.js'

interface AdminUser {
  id?: number
  username?: string
  avatar?: string
  [key: string]: any
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const tabStore = useAdminTabsStore()

const currentAdmin = userStore.currentAdmin as AdminUser
const currentTabTitle = computed(
  () => tabStore.tabs.find(t => t.path === route.path)?.title || '工作台'
)

// 全屏切换
const toggleFullscreen = (): void => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
}

const handleRefresh = (): void => {
  window.location.reload()
}

const toggleSidebar = (): void => {
  // TODO: 实现侧边栏折叠逻辑
}

const logout = async (): Promise<void> => {
  try {
    await authApi.logout()
  } catch (error: any) {
    ElMessage.error(error.message)
  }
  userStore.loadCurrentAdmin({ avatar: '', isAdmin: false })
  authStore.clearAdminToken()
  await router.push({ path: '/' })
}
</script>

<style scoped>
.my-header {
  height: 70px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

/* 左侧 */
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.icon-group {
  display: flex;
  align-items: center;
  gap: 2px;
}
.icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #475467;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.icon-btn:hover {
  background: #fff;
  color: #4f46e5;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
}
.crumb-item {
  color: #475467;
}
.crumb-sep {
  font-size: 11px;
}
.crumb-current {
  color: #4f46e5;
  font-weight: 500;
}

/* 右侧 */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.home-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  color: #475467;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.home-btn:hover {
  background: #fff;
  color: #4f46e5;
}
.header-divider {
  height: 14px;
}

/* 用户区 */
.user-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 4px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  transition: background 0.15s ease;
}
.user-badge:hover {
  background: #eef2ff;
}
.user-badge-avatar {
  flex-shrink: 0;
}
.user-badge-name {
  font-weight: 500;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-arrow {
  font-size: 12px;
  color: #94a3b8;
}
</style>
