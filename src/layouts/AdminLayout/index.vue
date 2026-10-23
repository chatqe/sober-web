<template>
  <div class="admin-container">
    <sidebar />
    <div class="right-panel">
      <my-header />
      <div class="content-box">
        <div
          v-if="uiStore.contentProgressKey > 0"
          :key="uiStore.contentProgressKey"
          class="content-progress"
        ></div>
        <div ref="contentRef" class="content">
          <router-view v-slot="{ Component }">
            <transition name="content-fade" mode="out-in">
              <component :is="Component" :key="viewKey" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MyHeader from "@/layouts/AdminLayout/components/Header/index.vue";
import Sidebar from "@/layouts/AdminLayout/components/Sidebar/index.vue";
import { useAdminTabsStore } from '@/stores/modules/adminTabs'
import { useUiStore } from '@/stores/modules/ui'

const route = useRoute()
const tabStore = useAdminTabsStore()
const uiStore = useUiStore()
const contentRef = ref<HTMLElement | null>(null)

// 刷新标识变化时重建当前路由组件，仅影响内容区
const viewKey = computed(() => `${route.path}-${uiStore.contentRefreshKey}`)

// 刷新或切换页面后回到内容区顶部
watch(viewKey, async () => {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.scrollTop = 0
  }
})

onMounted(() => {
  tabStore.initFromRoute(route as any)
})
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: rgba(250, 251, 252, 1);
}
.content-box {
  position: relative;
  flex: 1;
  overflow: hidden;
  background: rgba(250, 251, 252, 1);
}
.content {
  height: 100%;
  padding: 0 20px;
  overflow: auto;
}

/* 刷新/切换页面时内容区顶部的轻量进度条 */
.content-progress {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  transform-origin: left center;
  pointer-events: none;
  animation: content-progress 420ms ease-out forwards;
}
@keyframes content-progress {
  0% { transform: scaleX(0); opacity: 1; }
  55% { transform: scaleX(0.82); opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}

/* 当前页面入场过渡 */
.content-fade-enter-active {
  transition: opacity 180ms ease, transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.content-fade-leave-active {
  transition: opacity 70ms ease;
}
.content-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.content-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .content-progress {
    animation: none;
    opacity: 0;
  }
  .content-fade-enter-active,
  .content-fade-leave-active {
    transition: none;
  }
}
</style>
