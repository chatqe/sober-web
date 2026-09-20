<template>
  <header class="my-header">
    <div class="header-left">
      <div class="logo-area">
        <div class="logo-dot"></div>
        <span class="logo-title">后台管理</span>
      </div>
    </div>
    <div class="header-right">
      <div class="home-btn" @click="router.push({ path: '/' })">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </div>
      <el-divider direction="vertical" class="header-divider" />
      <div class="user-area">
        <el-dropdown placement="bottom" :show-timeout="100" :hide-timeout="150">
          <div class="user-trigger">
            <el-avatar
              :size="36"
              :src="currentAdmin.avatar"
              class="user-avatar"
            />
            <span class="user-name">{{ currentAdmin.username || '管理员' }}</span>
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
  </header>
</template>

<script setup lang="ts">
import { useAuthStore, useUserStore } from '@/stores'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { House, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import { authApi } from '@/api/index.js'

interface AdminUser {
  id?: number
  username?: string
  avatar?: string
  [key: string]: any
}

const userStore = useUserStore()
const authStore = useAuthStore()
const currentAdmin = userStore.currentAdmin as AdminUser

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
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* 左侧 Logo */
.header-left {
  display: flex;
  align-items: center;
}
.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  flex-shrink: 0;
}
.logo-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1d2e;
  letter-spacing: 0.5px;
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.home-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #475467;
  cursor: pointer;
  transition: all 0.15s ease;
}
.home-btn:hover {
  background: #f1f5f9;
  color: #4f46e5;
}
.header-divider {
  height: 16px;
}

/* 用户区 */
.user-area {
  display: flex;
  align-items: center;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.user-trigger:hover {
  background: #f1f5f9;
}
.user-avatar {
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
}
.user-name {
  font-size: 13px;
  color: #1a1d2e;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-arrow {
  font-size: 12px;
  color: #94a3b8;
}
</style>
