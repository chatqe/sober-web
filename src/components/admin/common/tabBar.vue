<template>
  <div class="tab-bar">
    <div class="tab-scroll" ref="scrollRef">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        :class="['tab-item', { active: tab.path === activePath }]"
        @click="handleClick(tab.path)"
      >
        <span class="tab-title">{{ tab.title }}</span>
        <el-icon
          v-if="tab.path !== '/admin/main'"
          class="tab-close"
          @click.stop="handleClose(tab.path)"
        ><Close /></el-icon>
      </div>
    </div>
    <div class="tab-more">
      <el-icon><ArrowDown /></el-icon>
    </div>
    <el-dropdown :show-timeout="80" :hide-timeout="120" @command="handleMoreCommand">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOthers">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminTabsStore, type RouteTab } from '@/stores/modules/adminTabs'
import { Close, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useAdminTabsStore()

const tabs = computed(() => store.tabs)
const activePath = computed(() => store.activePath)

const scrollRef = ref<HTMLElement | null>(null)

const scrollToTab = (path: string): void => {
  const el = scrollRef.value
  if (!el) return
  const items = el.querySelectorAll<HTMLElement>('.tab-item')
  const target = Array.from(items).find(i => i.dataset.path === path)
  if (target) {
    target.scrollIntoView({ block: 'nearest', inline: 'center' })
  }
}

const handleClick = (path: string): void => {
  router.push(path)
}

const handleClose = (path: string): void => {
  store.closeTab(path)
  const remaining = store.tabs
  if (remaining.length > 0) {
    router.push(remaining[remaining.length - 1].path)
  }
}

const handleMoreCommand = (cmd: string): void => {
  if (cmd === 'closeOthers') {
    const cur = store.tabs.find(t => t.path === activePath.value)
    if (cur) store.closeOthers(cur.path)
    router.push(cur?.path || '/admin/main')
  } else {
    store.closeAll()
    router.push('/admin/main')
  }
}

// 路由变化时自动添加页签
watch(
  () => route.fullPath,
  (newRoute) => {
    // Vue Router fullPath 带 query，但 tab 用 path（不带 query）
    const path = newRoute.includes('?') ? newRoute.split('?')[0] : newRoute
    store.addTab({ path, fullPath: newRoute, name: route.name as any } as any)
    nextTick(() => scrollToTab(path))
  },
  { immediate: true }
)
</script>

<style scoped>
.tab-bar {
  display: flex;
  align-items: center;
  height: 38px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 12px;
  gap: 4px;
  user-select: none;
}

.tab-scroll {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  min-width: 0;
}
.tab-scroll::-webkit-scrollbar {
  display: none;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 12.5px;
  color: #475467;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.tab-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}
.tab-item.active {
  background: #eef2ff;
  color: #4f46e5;
  border-color: rgba(99, 102, 241, 0.2);
  font-weight: 500;
}

.tab-title {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  font-size: 12px;
  opacity: 0;
  border-radius: 3px;
  padding: 1px;
  transition: opacity 0.15s, background 0.15s;
  flex-shrink: 0;
}
.tab-item:hover .tab-close {
  opacity: 0.6;
}
.tab-close:hover {
  opacity: 1 !important;
  background: rgba(0,0,0,0.08);
}

.tab-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  color: #94a3b8;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.tab-more:hover {
  background: #f1f5f9;
  color: #475467;
}
</style>
