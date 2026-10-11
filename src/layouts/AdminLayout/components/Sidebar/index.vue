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
      :unique-opened="true"
      @select="handleMenuSelect"
    >
      <template v-for="item in menuItems" :key="item.index">
        <el-sub-menu v-if="item.subs?.length" :index="item.index">
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
import { useAuthStore, useUserStore, useAdminTabsStore } from '@/stores'
import {
  House, Setting, User, Document, Notebook,
  EditPen, ChatDotRound, Paperclip, CreditCard, Sugar, Monitor, CollectionTag,
} from '@element-plus/icons-vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const tabStore = useAdminTabsStore()

const isAdmin = computed(() => authStore.isAdmin || userStore.currentAdmin?.isAdmin || false)
const currentRoutePath = computed(() => router.currentRoute.value.path)

const menuItems = computed(() =>
  ([
    { icon: House,         index: '/admin/main',             title: '报表管理', isAdmin: true  },
    { icon: Document,      index: '/admin/article/list',     title: '文章管理', isAdmin: false, subs: [
      { index: '/admin/article/list', title: '文章列表' },
      { index: '/admin/article/edit', title: '文章编辑' },
    ]},
    { icon: EditPen,       index: '/admin/comment/list',      title: '评论管理', isAdmin: false },
    { icon: Notebook,      index: '/admin/category/list',     title: '分类管理', isAdmin: true  },
    { icon: Sugar,         index: '/admin/loveList',         title: '表白墙',   isAdmin: true  },
    { icon: ChatDotRound,  index: '/admin/danmaku/list',        title: '弹幕管理', isAdmin: true  },
    { icon: Paperclip,     index: '/admin/resourceList',     title: '资源管理', isAdmin: true  },
    { icon: CreditCard,    index: '/admin/resourcePathList', title: '资源聚合', isAdmin: true  },
    { icon: CollectionTag, index: '/admin/tag/list',         title: '标签管理', isAdmin: true  },
    { icon: Setting,       index: '/admin/webEdit',          title: '网站设置', isAdmin: true  },
    { icon: User,          index: '/admin/user/list',         title: '用户管理', isAdmin: true  },
  ] as any[]).filter(item => isAdmin.value || !item.isAdmin)
)

const handleMenuSelect = (index: string): void => {
  if (index === router.currentRoute.value.path) {
    tabStore.addTab(router.currentRoute.value as any)
  } else {
    router.push(index)
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   1) 覆盖 Element Plus 的布局变量 —— 一行顶十行 CSS
   base=12px 顶级项左内边距；level=36px 每一级递进
   → 子菜单项自动 = 12 + 36 = 48px，无需手写 !important
   ═══════════════════════════════════════════════ */
.sidebar-menu {
  --el-menu-base-level-padding: 12px;
  --el-menu-level-padding: 36px;
  --el-menu-item-height: 40px;
  --el-menu-sub-item-height: 40px;      /* ✅ 子项高度 = 顶级 */
  --el-menu-hover-bg-color: transparent;   /* 关掉 Element Plus 默认灰底 hover */
}

/* ═══ 容器 ═══ */
.sidebar {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e2e8f0;
}
.sidebar::-webkit-scrollbar { width: 0; }

/* ═══ Logo ═══ */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 14px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.logo-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99,102,241,.3);
}
.logo-text {
  font-size: 15px; font-weight: 700; color: #1e293b;
  letter-spacing: .5px; white-space: nowrap;
}

/* ═══ 菜单容器 ═══ */
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

/* ═══════════════════════════════════════════════
   2) 所有菜单项 / 子菜单标题：一份样式管到底
   不需要区分顶级和子级 —— 缩进由上面的变量负责
   ═══════════════════════════════════════════════ */
.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  position: relative;
  margin: 2px 6px;
  border-radius: 10px;
  font-size: 13.5px;
  color: #475467;
  transition: background .2s cubic-bezier(.4,0,.2,1),
              color .2s cubic-bezier(.4,0,.2,1),
              transform .15s cubic-bezier(.4,0,.2,1),
              box-shadow .2s cubic-bezier(.4,0,.2,1);
}

/* 左侧紫色指示条 */
.sidebar-menu :deep(.el-menu-item)::before,
.sidebar-menu :deep(.el-sub-menu__title)::before {
  content: '';
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px; height: 20px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #818cf8, #6366f1);
  transition: transform .25s cubic-bezier(.34,1.56,.64,1);
}

/* ═══ Hover：纯 CSS，无需任何 JS ═══ */
.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background: linear-gradient(90deg, rgba(99,102,241,.06) 0%, rgba(99,102,241,.02) 60%, transparent 100%);
  color: #1e293b;
  transform: translateX(2px);
  box-shadow: inset 0 0 0 1px rgba(99,102,241,.08);
}
.sidebar-menu :deep(.el-menu-item:hover)::before,
.sidebar-menu :deep(.el-sub-menu__title:hover)::before {
  transform: translateY(-50%) scaleY(1);
}


/* ═══ 激活态：只作用于真正的 el-menu-item（叶子项） ═══ */
.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(99,102,241,.12), inset 0 0 0 1px rgba(99,102,241,.1);
  transform: translateX(0);
}
.sidebar-menu :deep(.el-menu-item.is-active)::before {
  transform: translateY(-50%) scaleY(1);
  background: linear-gradient(180deg, #818cf8, #4f46e5);
}
.sidebar-menu :deep(.el-menu-item.is-active .el-icon) {
  opacity: 1;
  color: #4f46e5;
  transform: scale(1.05);
}

/* ═══ 父级 sub-menu 被自动加 .is-active 时，强制还原为常态 ═══
   用 :where() 把特异性降到 0，保证 hover 规则永远能赢  */
.sidebar-menu :where(:deep(.el-sub-menu.is-active > .el-sub-menu__title)) {
  background: transparent;
  color: #475467;
  font-weight: normal;
  box-shadow: none;
  transform: none;
}
.sidebar-menu :where(:deep(.el-sub-menu.is-active > .el-sub-menu__title))::before {
  transform: translateY(-50%) scaleY(0);
  background: linear-gradient(180deg, #818cf8, #6366f1);
}
.sidebar-menu :where(:deep(.el-sub-menu.is-active > .el-sub-menu__title)) .el-icon {
  color: inherit;
  opacity: .72;
  transform: none;
}

/* ═══ 图标 ═══ */
.sidebar-menu :deep(.el-menu-item .el-icon),
.sidebar-menu :deep(.el-sub-menu__title .el-icon) {
  font-size: 16px;
  margin-right: 8px;
  opacity: .72;
  flex-shrink: 0;
  transition: opacity .2s, transform .2s cubic-bezier(.34,1.56,.64,1);
}
.sidebar-menu :deep(.el-menu-item:hover .el-icon),
.sidebar-menu :deep(.el-sub-menu__title:hover .el-icon) {
  opacity: 1;
  transform: scale(1.08);
}
.sidebar-menu :deep(.el-menu-item.is-active .el-icon),
.sidebar-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title .el-icon) {
  opacity: 1;
  color: #4f46e5;
  transform: scale(1.05);
}

/* ═══ 子菜单箭头 ═══ */
.sidebar-menu :deep(.el-sub-menu__icon-arrow) {
  margin-right: 2px;
  font-size: 12px;
  opacity: .45;
  transition: opacity .2s, transform .25s cubic-bezier(.4,0,.2,1);
}
.sidebar-menu :deep(.el-sub-menu__title:hover .el-sub-menu__icon-arrow) {
  opacity: .8;
}
.sidebar-menu :deep(.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow) {
  transform: rotate(90deg);
  opacity: .7;
}
</style>
