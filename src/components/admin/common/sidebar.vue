<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <el-icon size="20"><Monitor /></el-icon>
      </div>
      <span class="logo-text">控制台</span>
    </div>
    <el-menu
      class="sidebar-el-menu"
      background-color="transparent"
      text-color="#475467"
      active-text-color="#4f46e5"
      :unique-opened="true"
      :default-active="currentRoutePath"
      :router="true"
    >
      <template v-for="item in filteredItems" :key="item.index">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index">
            <template #title>
              <el-icon><component :is="getIconComponent(item.icon)" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs" :key="subItem.index">
              <el-sub-menu v-if="subItem.subs" :index="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="threeItem in subItem.subs"
                  :key="threeItem.index"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <el-icon><component :is="getIconComponent(item.icon)" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import router from '@/router'
import { useAuthStore, useUserStore } from '@/stores'
import {
  House,
  Setting,
  User,
  Document,
  Notebook,
  EditPen,
  ChatDotRound,
  Paperclip,
  CreditCard,
  Sugar,
  Monitor
} from '@element-plus/icons-vue'

const authStore = useAuthStore()
const userStore = useUserStore()

const isAdmin = computed(() => authStore.isAdmin || userStore.currentAdmin?.isAdmin || false)
const currentRoutePath = computed(() => router.currentRoute.value.path)

const items = [
  { icon: House, index: 'main', title: '报表管理', isAdmin: true },
  { icon: Setting, index: 'webEdit', title: '网站设置', isAdmin: true },
  { icon: User, index: 'userList', title: '用户管理', isAdmin: true },
  { icon: Document, index: 'postList', title: '文章管理', isAdmin: false },
  { icon: Notebook, index: 'categoryList', title: '分类管理', isAdmin: true },
  { icon: EditPen, index: 'commentList', title: '评论管理', isAdmin: false },
  { icon: ChatDotRound, index: 'treeHoleList', title: '弹幕管理', isAdmin: true },
  { icon: Paperclip, index: 'resourceList', title: '资源管理', isAdmin: true },
  { icon: CreditCard, index: 'resourcePathList', title: '资源聚合', isAdmin: true },
  { icon: Sugar, index: 'loveList', title: '表白墙', isAdmin: true },
]

const filteredItems = computed(() => items.filter(item => isAdmin.value || !item.isAdmin))
const getIconComponent = (icon) => icon
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 70px;
  bottom: 0;
  width: 200px;
  overflow-y: auto;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar::-webkit-scrollbar { width: 0; }

/* Logo 区域 */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #1a1d2e;
  letter-spacing: 0.5px;
}

/* 菜单 */
.sidebar-el-menu {
  flex: 1;
  border: none;
  background: transparent !important;
  padding: 8px 0;
}
.sidebar-el-menu:not(.el-menu--collapse) { width: 100%; }

.sidebar-el-menu .el-menu-item,
.sidebar-el-menu .el-sub-menu__title {
  margin: 2px 8px !important;
  border-radius: 8px !important;
  height: 42px !important;
  line-height: 42px !important;
  padding: 0 12px !important;
  font-size: 14px;
  transition: all 0.15s ease;
}

.sidebar-el-menu .el-menu-item:hover,
.sidebar-el-menu .el-sub-menu__title:hover {
  background: #f1f5f9;
  color: #1a1d2e;
}

.sidebar-el-menu .el-menu-item.is-active,
.sidebar-el-menu .el-sub-menu__title.is-active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.1);
}

/* 子菜单展开箭头 */
.sidebar-el-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
  margin-right: 4px;
}
</style>
