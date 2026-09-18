<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <el-icon><Monitor /></el-icon>
      </div>
      <span class="logo-text">控制台</span>
    </div>

    <!-- 菜单 -->
    <el-menu
      class="sidebar-menu"
      :default-active="currentRoutePath"
      :router="true"
      :unique-opened="true"
    >
      <template v-for="group in menuGroups" :key="group.label">
        <!-- 分组标题 -->
        <div class="menu-group-label">{{ group.label }}</div>

        <!-- 菜单项 -->
        <template v-for="item in group.items" :key="item.index">
          <!-- 有子菜单 -->
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
          <!-- 普通菜单项 -->
          <el-menu-item v-else :index="item.index">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
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

// 按功能分组的菜单数据
const menuGroups = computed(() => {
  const base = [
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
  ].filter(item => isAdmin.value || !item.isAdmin)

  return [
    { label: '概览',     items: [base[0]] },
    { label: '内容管理', items: base.slice(1, 6) },
    { label: '系统管理', items: base.slice(6) },
  ]
})
</script>

<style scoped>
/* ── Sidebar 容器 ── */
.sidebar {
  position: fixed;
  left: 0;
  top: 70px;
  bottom: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  z-index: 1000;
  overflow: hidden;
}

.sidebar::-webkit-scrollbar { width: 0; }

/* ── Logo 区域 ── */
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
  padding: 8px 0 16px;
}
.sidebar-menu:not(.el-menu--collapse) { width: 100%; }

/* 自定义滚动条 */
.sidebar-menu::-webkit-scrollbar { width: 4px; }
.sidebar-menu::-webkit-scrollbar-track { background: transparent; }
.sidebar-menu::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

/* ── 分组标题 ── */
.menu-group-label {
  padding: 16px 20px 6px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
}

/* ── 菜单项通用 ── */
.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  position: relative;
  margin: 2px 8px !important;
  border-radius: 8px !important;
  height: 42px !important;
  line-height: 42px !important;
  padding: 0 12px !important;
  font-size: 13.5px;
  color: #475467;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 左侧活跃指示条 */
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
  background: #6366f1;
  transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-menu .el-menu-item:hover::before,
.sidebar-menu .el-sub-menu__title:hover::before {
  transform: translateY(-50%) scaleY(1);
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background: #f1f5f9;
  color: #1e293b;
}

/* 激活状态 */
.sidebar-menu .el-menu-item.is-active,
.sidebar-menu .el-sub-menu__title.is-active {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.1);
}

.sidebar-menu .el-menu-item.is-active::before,
.sidebar-menu .el-sub-menu__title.is-active::before {
  transform: translateY(-50%) scaleY(1);
  background: linear-gradient(180deg, #818cf8, #6366f1);
}

/* 图标 */
.sidebar-menu .el-menu-item .el-icon,
.sidebar-menu .el-sub-menu__title .el-icon {
  font-size: 16px;
  margin-right: 8px;
  opacity: 0.8;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.sidebar-menu .el-menu-item:hover .el-icon,
.sidebar-menu .el-sub-menu__title:hover .el-icon {
  opacity: 1;
}
.sidebar-menu .el-menu-item.is-active .el-icon,
.sidebar-menu .el-sub-menu__title.is-active .el-icon {
  opacity: 1;
  color: #4f46e5;
}

/* 子菜单箭头 */
.sidebar-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
  margin-right: 4px;
  font-size: 12px;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.sidebar-menu .el-sub-menu__title:hover .el-sub-menu__icon-arrow {
  opacity: 0.8;
}

/* 子菜单展开时父级高亮 */
.sidebar-menu .el-sub-menu.is-opened > .el-sub-menu__title {
  color: #334155;
  background: rgba(99, 102, 241, 0.04);
}
.sidebar-menu .el-sub-menu.is-opened > .el-sub-menu__title .el-icon {
  opacity: 1;
}

/* 子菜单项 */
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
