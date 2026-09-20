<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <el-icon><Monitor /></el-icon>
      </div>
      <span class="logo-text">控制台</span>
    </div>

    <el-menu
      class="sidebar-menu"
      :default-active="currentRoutePath"
      :router="true"
      :unique-opened="true"
    >
      <template v-for="item in menuItems" :key="item.index">
        <template v-if="item.subs?.length">
          <el-sub-menu :index="item.index">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="sub in item.subs" :key="sub.index">
              <el-sub-menu v-if="sub.subs?.length" :index="sub.index">
                <template #title>{{ sub.title }}</template>
                <el-menu-item
                  v-for="third in sub.subs"
                  :key="third.index"
                  :index="third.index"
                >{{ third.title }}</el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="sub.index">{{ sub.title }}</el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <el-menu-item v-else :index="item.index">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import router from '@/router'
import { useAuthStore, useUserStore } from '@/stores'
import {
  House, Setting, User, Document, Notebook,
  EditPen, ChatDotRound, Paperclip, CreditCard, Sugar, Monitor,
} from '@element-plus/icons-vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const isAdmin = computed(() => authStore.isAdmin || userStore.currentAdmin?.isAdmin || false)
const currentRoutePath = computed(() => router.currentRoute.value.path)

const menuItems = computed(() => [
  { icon: House,     index: 'main',         title: '报表管理', isAdmin: true  },
  { icon: Document,  index: 'postList',     title: '文章管理', isAdmin: false },
  { icon: EditPen,   index: 'commentList',  title: '评论管理', isAdmin: false },
  { icon: Notebook,  index: 'categoryList', title: '分类管理', isAdmin: true  },
  { icon: Sugar,     index: 'loveList',     title: '表白墙',   isAdmin: true  },
  { icon: ChatDotRound, index: 'treeHoleList', title: '弹幕管理', isAdmin: true },
  { icon: Paperclip, index: 'resourceList', title: '资源管理', isAdmin: true  },
  { icon: CreditCard, index: 'resourcePathList', title: '资源聚合', isAdmin: true },
  { icon: Setting,   index: 'webEdit',     title: '网站设置', isAdmin: true  },
  { icon: User,      index: 'userList',    title: '用户管理', isAdmin: true  },
].filter(item => isAdmin.value || !item.isAdmin) as any[])
</script>

<style scoped>
/* ── Sidebar 容器 ── */
.sidebar {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e2e8f0;
}

.sidebar::-webkit-scrollbar { width: 0; }

/* ── Logo ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 14px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}
.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* ── 菜单容器 ── */
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  background: transparent !important;
  padding: 10px 0 16px;
}
.sidebar-menu:not(.el-menu--collapse) { width: 100%; }

.sidebar-menu::-webkit-scrollbar { width: 4px; }
.sidebar-menu::-webkit-scrollbar-track { background: transparent; }
.sidebar-menu::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

/* ── 菜单项通用 ── */
.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  position: relative;
  margin: 1px 6px !important;
  border-radius: 10px !important;
  height: 42px !important;
  line-height: 42px !important;
  padding: 0 12px !important;
  font-size: 13.5px;
  color: #475467;
  transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 左侧指示条 */
.sidebar-menu .el-menu-item::before,
.sidebar-menu .el-sub-menu__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 20px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #818cf8, #6366f1);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sidebar-menu .el-menu-item:hover::before,
.sidebar-menu .el-sub-menu__title:hover::before {
  transform: translateY(-50%) scaleY(1);
}

/* Hover 效果 */
.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background: linear-gradient(90deg, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.02) 60%, transparent 100%);
  color: #1e293b;
  transform: translateX(2px);
  box-shadow: inset 0 0 0 1px rgba(99,102,241,0.08);
}

/* 激活状态 */
.sidebar-menu .el-menu-item.is-active,
.sidebar-menu .el-sub-menu__title.is-active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12), inset 0 0 0 1px rgba(99,102,241,0.1);
  transform: translateX(0);
}

.sidebar-menu .el-menu-item.is-active::before,
.sidebar-menu .el-sub-menu__title.is-active::before {
  transform: translateY(-50%) scaleY(1);
  background: linear-gradient(180deg, #818cf8, #4f46e5);
}

/* 图标 */
.sidebar-menu .el-menu-item .el-icon,
.sidebar-menu .el-sub-menu__title .el-icon {
  font-size: 16px;
  margin-right: 8px;
  opacity: 0.72;
  transition: opacity 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}
.sidebar-menu .el-menu-item:hover .el-icon,
.sidebar-menu .el-sub-menu__title:hover .el-icon {
  opacity: 1;
  transform: scale(1.08);
}
.sidebar-menu .el-menu-item.is-active .el-icon,
.sidebar-menu .el-sub-menu__title.is-active .el-icon {
  opacity: 1;
  color: #4f46e5;
  transform: scale(1.05);
}

/* 子菜单箭头 */
.sidebar-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
  margin-right: 2px;
  font-size: 12px;
  opacity: 0.45;
  transition: opacity 0.2s, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow {
  opacity: 0.8;
}
.sidebar-menu .el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow {
  transform: rotate(90deg);
  opacity: 0.7;
}

/* 子菜单展开时父级高亮 */
.sidebar-menu .el-sub-menu.is-opened > .el-sub-menu__title {
  color: #334155;
  background: rgba(99, 102, 241, 0.05);
}
.sidebar-menu .el-sub-menu.is-opened > .el-sub-menu__title .el-icon {
  opacity: 1;
}

/* 子菜单项（缩进） */
.sidebar-menu .el-menu-item {
  padding-left: 48px !important;
  font-size: 13px;
  height: 38px !important;
  line-height: 38px !important;
}
.sidebar-menu .el-menu-item .el-icon {
  font-size: 14px;
  margin-right: 6px;
}

/* 二级子菜单 */
.sidebar-menu .el-sub-menu .el-sub-menu__title {
  padding-left: 48px !important;
}
.sidebar-menu .el-sub-menu .el-sub-menu__title .el-icon {
  margin-right: 6px;
}
</style>
