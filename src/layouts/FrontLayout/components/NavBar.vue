<template>
  <transition name="el-fade-in-linear">
    <div
      @mouseenter="hoverEnter = true"
      @mouseleave="hoverEnter = false"
      :class="[
        { 'not-top': notTop },
        { 'is-hidden': !dataShow },
        { hoverEnter: (hoverEnter || route.path.includes('/favorite') || route.path === '/travel') && !notTop },
      ]"
      class="toolbar-content myBetween"
    >
      <!-- 网站名称 -->
      <div class="toolbar-title">
        <h2 @click="navigate({ path: '/' })">{{ webInfoStore.webInfo?.webName }}</h2>
      </div>

      <!-- 手机导航按钮 -->
      <button
        v-if="mobile"
        type="button"
        class="toolbar-mobile-menu"
        aria-label="打开菜单"
        :aria-expanded="uiStore.toolbarDrawer"
        @click="uiStore.openToolbarDrawer()"
      >
        <el-icon class="mobile-menu-icon">
          <Menu />
        </el-icon>
      </button>

      <!-- 桌面端导航列表 -->
      <div v-else class="desktop-nav">
        <ul class="scroll-menu">
          <li @click="navigate({ path: '/' })">
            <div class="my-menu">🏡 <span>首页</span></div>
          </li>

          <li @click="navigate({ path: '/moment' })">
            <div class="my-menu">🏖️ <span>随笔</span></div>
          </li>

          <li @click="navigate({ path: '/travel' })">
            <div class="my-menu">🌏 <span>旅拍</span></div>
          </li>

          <el-dropdown
            popper-class="new-el-dropdown"
            :hide-timeout="500"
            placement="bottom"
          >
            <li>
              <div class="my-menu" @mouseenter="recordExpanded = true" @mouseleave="recordExpanded = false">📒 <span>记录</span></div>
            </li>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(sort, index) in sortItems" :key="index">
                  <div @click="navigate({ path: '/sort', query: { sortId: sort.id } })">
                    {{ sort.name }}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <li @click="navigate({ path: '/love' })">
            <div class="my-menu">❤️‍🔥 <span>小窝</span></div>
          </li>

          <el-dropdown
            popper-class="new-el-dropdown"
            :hide-timeout="500"
            placement="bottom"
          >
            <li>
              <div class="my-menu" @mouseenter="toolboxExpanded = true" @mouseleave="toolboxExpanded = false">🧰 <span>百宝箱</span></div>
            </li>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div @click="navigate({ name: 'favMusic' })">🎧︎ 音乐</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="navigate({ name: 'favCollect' })">收藏夹</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="navigate({ name: 'favFriend' })">💃 友链</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <li @click="navigate({ path: '/danmaku' })">
            <div class="my-menu">📪 <span>弹幕</span></div>
          </li>

          <li @click="navigate({ path: '/message' })">
            <div class="my-menu">💬 <span>留言</span></div>
          </li>

          <li v-if="adminLogin" @click="goAdmin({ path: '/admin' })">
            <div class="my-menu">💻️ <span>后台</span></div>
          </li>
        </ul>
      </div>

      <!-- 个人中心 -->
      <div v-if="!mobile" class="user-center">
        <div v-if="$common.isEmpty(userStore.currentUser)" class="login-wrap">
          <button class="login-avtar" @click="uiStore.openAuthModal()">
            <IconEpUserFilled class="icon-user" />
          </button>
        </div>
        <el-dropdown
          v-else
          placement="bottom"
          @visible-change="(v: boolean) => (userExpanded = v)"
        >
          <el-avatar
            class="user-avatar"
            :size="36"
            :src="userStore.currentUser?.avatar || webInfoStore.webInfo?.avatar"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="navigate({ path: '/user' })">
                <el-icon style="margin-right: 8px; vertical-align: -2px"><User /></el-icon>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item @click="handleLogout">
                <el-icon style="margin-right: 8px; vertical-align: -2px"><SwitchButton /></el-icon>
                <span>退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Menu, SwitchButton, User } from '@element-plus/icons-vue'
import { authApi } from '@/api'
import { useUiStore } from '@/stores/modules/ui'
import { useAuthStore } from '@/stores/modules/auth'
import { useWebInfoStore } from '@/stores/modules/webInfo'
import { useUserStore } from '@/stores/modules/user'
import { useScrollStore } from '@/stores/modules/scroll'
import { useSortInfoStore } from '@/stores/modules/categoryInfo'
import type { CommonUtils } from '@/types'

const route = useRoute()
const router = useRouter()
const $common: CommonUtils = inject('$common')!
const uiStore = useUiStore()
const authStore = useAuthStore()
const webInfoStore = useWebInfoStore()
const userStore = useUserStore()
const scrollStore = useScrollStore()
const sortInfoStore = useSortInfoStore()

const adminLogin = computed(() => authStore.isAdmin)
const mobile = computed(() => uiStore.mobile)

const hoverEnter = ref(false)

// dropdown 展开追踪：任一展开时导航不隐藏
const recordExpanded = ref(false)
const toolboxExpanded = ref(false)
const userExpanded = ref(false)
const dropdownExpanded = computed(
  () => recordExpanded.value || toolboxExpanded.value || userExpanded.value,
)

// 隐藏阈值：视口高度 35%（对应原版写死的 350px）
const hideThreshold = computed(() => Math.max(350, scrollStore.innerHeight * 0.35))

// 胶囊态：滚动超过 20px
const notTop = computed(() => scrollStore.scrollY > 20)

// 是否显示：移动端始终显示；dropdown 展开时不隐藏；
// 超过阈值后仅在向上滚动（或阈值以内）时显示，向下滚动上滑隐藏
const dataShow = computed(() => {
  if (mobile.value) return true
  if (dropdownExpanded.value) return true
  if (scrollStore.scrollY < hideThreshold.value) return true
  return scrollStore.direction !== 'down'
})

const sortItems = computed(() =>
  sortInfoStore.sortInfo.filter((item: any) => item.isShow !== 0),
)

// NavBar 里 navigate 只负责路由跳转，不关闭 drawer。
// 原因：NavBar 的菜单只在桌面端渲染（v-else 分支），移动端入口在 FrontLayout 的 el-drawer 里。
function navigate(to: RouteLocationRaw): void {
  router.push(to)
}

function goAdmin(data: { path: string }): void {
  window.open(`${window.location.origin}${data.path}`)
}

async function handleLogout(): Promise<void> {
  try {
    await authApi.logout()
    userStore.loadCurrentUser({})
    localStorage.removeItem('userToken')
    ElMessage.success('退出成功')
    await router.push({ path: '/' })
  } catch (error: any) {
    console.error('[logout error]', error)
    ElMessage.error(error?.message || '退出失败')
  }
}
</script>

<style scoped>
.toolbar-content {
  width: 100%;
  height: 60px;
  color: var(--white);
  user-select: none;
  top: 0;
  transition:
    top 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease,
    border-radius 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    margin-inline 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.toolbar-content.hoverEnter {
  box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
}

/* 胶囊态：边框 + 背景 + 阴影 + 模糊 + 距顶 16px（对齐原版 top: 1rem） */
.toolbar-content.not-top {
  top: 16px;
  background-color: var(--navbar-capsule-bg);
  border: 1px solid var(--navbar-capsule-border);
  border-radius: 16px;
  box-shadow: var(--navbar-capsule-shadow);
  padding-inline: 0.375rem;
  color: var(--navbar-text);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

/* 桌面端胶囊态：内容自适应宽度 + 居中（left:0 right:0 + margin auto 平分，max-width 84% 兜底） */
@media (min-width: 800px) {
  .toolbar-content.not-top {
    left: 0;
    right: 0;
    width: fit-content;
    max-width: 84%;
    margin-inline: auto;
    padding-inline: 1.25rem;
  }
}

/* 上滑隐藏：位移后释放事件层，避免 fixed 盒子继续拦截顶部点击 */
.toolbar-content.is-hidden {
  transform: translateY(-5rem);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .toolbar-content,
  .toolbar-content.not-top {
    transition: none !important;
  }
}

.toolbar-title {
  margin-left: 30px;
  cursor: pointer;
}

.toolbar-mobile-menu {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mobile-menu-icon {
  font-size: 26px;
}

.scroll-menu {
  margin: 0 25px 0 0;
  display: flex;
  justify-content: flex-end;
  padding: 0;
  align-items: center;
}

.desktop-nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.scroll-menu li {
  list-style: none;
  margin: 0 12px;
  font-size: 17px;
  height: 60px;
  line-height: 60px;
  position: relative;
  cursor: pointer;
}

.scroll-menu li:hover .my-menu span {
  color: var(--themeBackground);
}

.scroll-menu li:hover .my-menu i {
  color: var(--themeBackground);
  animation: scale 1.5s ease-in-out infinite;
}

.scroll-menu li .my-menu:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  height: 6px;
  background-color: var(--themeBackground);
  width: 100%;
  max-width: 0;
  transition: max-width 0.25s ease-in-out;
}

.scroll-menu li:hover .my-menu:after {
  max-width: 100%;
}

.scroll-menu li:focus-visible {
  outline: none;
}

.scroll-menu li .my-menu span {
  color: var(--white);
}

.toolbar-content.not-top .scroll-menu li .my-menu span {
  color: var(--navbar-text);
}

.user-center {
  display: flex;
  align-items: center;
  height: 60px;
  margin-right: 25px;
}

.user-center :deep(.el-dropdown) {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0;
}

.login-wrap {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  left: 10px;
}

.login-avtar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--grey);
  cursor: pointer;
  border-radius: 50%;
  outline: 0;
  border: none;
  touch-action: manipulation;
  transition-duration: .2s;
  height: 30px;
  width: 30px;
}

.login-avtar:hover {
  box-shadow: 0 0 12px 5px color-mix(in srgb, var(--lightGreen) 100%, transparent);
}

.icon-user {
  width: 32px;
  height: 32px;
  color: var(--grey);
}

.icon-user:hover {
  color: var(--lightGreen);
}

.user-avatar {
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
  margin-top: 0;
}
</style>
