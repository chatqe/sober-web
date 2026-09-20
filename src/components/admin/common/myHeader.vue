<template>
  <div class="my-header">
    <div class="header-main">
      <div class="header-left">
        <el-tooltip content="侧边栏" placement="bottom" :show-timeout="200">
          <div class="icon-btn" @click="toggleSidebar">
            <el-icon><Menu /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="刷新" placement="bottom" :show-timeout="200">
          <div class="icon-btn" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
          </div>
        </el-tooltip>
        <div class="breadcrumb">
          <span class="crumb-item">仪表盘</span>
          <span class="crumb-sep">/</span>
          <span class="crumb-current">{{ currentTabTitle }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <el-icon class="search-icon"><Search /></el-icon>
          <span class="search-placeholder">搜索</span>
          <kbd>Ctrl K</kbd>
        </div>
        <div class="icon-btn" @click="router.push('/')">
          <el-icon><House /></el-icon>
        </div>
        <el-tooltip content="全屏" placement="bottom" :show-timeout="200">
          <div class="icon-btn" @click="toggleFullscreen">
            <el-icon><FullScreen /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="通知" placement="bottom" :show-timeout="200">
          <div class="icon-btn notification-btn">
            <el-icon><Bell /></el-icon>
            <span class="badge badge-red"></span>
          </div>
        </el-tooltip>
        <el-tooltip content="消息" placement="bottom" :show-timeout="200">
          <div class="icon-btn message-btn">
            <el-icon><ChatDotRound /></el-icon>
            <span class="badge badge-green"></span>
          </div>
        </el-tooltip>
        <el-tooltip content="阅读" placement="bottom" :show-timeout="200">
          <div class="icon-btn">
            <el-icon><Reading /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="设置" placement="bottom" :show-timeout="200">
          <div class="icon-btn">
            <el-icon><Setting /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="暗色模式" placement="bottom" :show-timeout="200">
          <div class="icon-btn">
            <el-icon><Moon /></el-icon>
          </div>
        </el-tooltip>
        <el-divider direction="vertical" class="header-divider" />
        <el-dropdown placement="bottom" :show-timeout="100" :hide-timeout="150">
          <div class="user-badge">
            <el-avatar :size="28" :src="currentAdmin.avatar" class="user-badge-avatar">
              {{ currentAdmin.username?.[0] || 'U' }}
            </el-avatar>
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
    <tab-bar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, useUserStore, useAdminTabsStore } from '@/stores'
import { ElMessage } from 'element-plus'
import {
  House, ArrowDown, SwitchButton, Bell, FullScreen, Moon, Menu, Refresh,
  Search, ChatDotRound, Reading, Setting,
} from '@element-plus/icons-vue'
import { authApi } from '@/api/index.js'
import TabBar from './tabBar.vue'

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

const handleRefresh = (): void => {
  window.location.reload()
}

const toggleFullscreen = (): void => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
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
  display: flex;
  flex-direction: column;
  background: rgba(250, 251, 252, 1);
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.header-main {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

/* 通用图标按钮 */
.icon-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.icon-btn:hover {
  background: #fff;
  color: #4f46e5;
}

/* 带红点/绿点徽章 */
.notification-btn .badge,
.message-btn .badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.badge-red   { background: #ef4444; }
.badge-green { background: #22c55e; }

/* 左侧 */
.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
  margin-left: 4px;
}
.crumb-item { color: #475467; }
.crumb-sep  { font-size: 11px; }
.crumb-current { color: #4f46e5; font-weight: 500; }

/* 右侧 */
.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.header-divider {
  height: 16px;
  margin: 0 4px;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 13px;
  cursor: text;
  transition: border-color 0.15s;
  margin-right: 4px;
}
.search-box:hover {
  border-color: #cbd5e1;
}
.search-icon { font-size: 14px; flex-shrink: 0; }
.search-placeholder { color: #94a3b8; }
.search-box kbd {
  font-size: 11px;
  color: #94a3b8;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 1px 5px;
  font-family: inherit;
  flex-shrink: 0;
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
  margin-left: 4px;
}
.user-badge:hover { background: #eef2ff; }
.user-badge-avatar { flex-shrink: 0; }
.user-badge-name {
  font-weight: 500;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-arrow { font-size: 12px; color: #94a3b8; }
</style>
