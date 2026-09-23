<template>
  <transition name="el-fade-in-linear">
    <div
      v-show="toolbar.visible || mobile"
      @mouseenter="hoverEnter = true"
      @mouseleave="hoverEnter = false"
      :class="[
        { enter: toolbar.enter },
        { hoverEnter: (hoverEnter || route.path.includes('/favorite') || route.path === '/travel') && !toolbar.enter },
      ]"
      class="toolbar-content myBetween"
    >
      <!-- 网站名称 -->
      <div class="toolbar-title">
        <h2 @click="navigate({ path: '/' })">{{ webInfoStore.webInfo?.webName }}</h2>
      </div>

      <!-- 手机导航按钮 -->
      <div
        v-if="mobile"
        class="toolbar-mobile-menu"
        @click="uiStore.openToolbarDrawer()"
        :class="{ enter: toolbar.enter }"
      >
        <el-icon class="mobile-menu-icon">
          <Menu />
        </el-icon>
      </div>

      <!-- 桌面端导航列表 -->
      <div v-else>
        <ul class="scroll-menu">
          <li @click="navigate({ path: '/' })">
            <div class="my-menu">🏡 <span>首页</span></div>
          </li>

          <li @click="navigate({ path: '/weiYan' })">
            <div class="my-menu">🏖️ <span>随笔</span></div>
          </li>

          <li @click="navigate({ path: '/travel' })">
            <div class="my-menu">🌏 <span>旅拍</span></div>
          </li>

          <el-dropdown popper-class="new-el-dropdown" :hide-timeout="500" placement="bottom">
            <li>
              <div class="my-menu">📒 <span>记录</span></div>
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

          <el-dropdown popper-class="new-el-dropdown" :hide-timeout="500" placement="bottom">
            <li>
              <div class="my-menu">🧰 <span>百宝箱</span></div>
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

          <li @click="navigate({ path: '/message' })">
            <div class="my-menu">📪 <span>留言</span></div>
          </li>

          <li v-if="adminLogin" @click="goAdmin({ path: '/admin' })">
            <div class="my-menu">💻️ <span>后台</span></div>
          </li>

          <!-- 个人中心 -->
          <li>
            <div v-if="$common.isEmpty(userStore.currentUser)" class="login-wrap">
              <button class="login-avtar" @click="uiStore.openAuthModal()">
                <IconEpUserFilled class="icon-user" />
              </button>
            </div>
            <el-dropdown v-else placement="bottom">
              <el-avatar
                class="user-avatar"
                :size="36"
                style="margin-top: 12px"
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
          </li>
        </ul>
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
import { useToolbarStore } from '@/stores/modules/toolbar'
import { useSortInfoStore } from '@/stores/modules/categoryInfo'
import type { CommonUtils } from '@/types'

const route = useRoute()
const router = useRouter()
const $common: CommonUtils = inject('$common')!
const uiStore = useUiStore()
const authStore = useAuthStore()
const webInfoStore = useWebInfoStore()
const userStore = useUserStore()
const toolStore = useToolbarStore()
const sortInfoStore = useSortInfoStore()

const toolbar = computed(() => toolStore.toolbar)
const adminLogin = computed(() => authStore.isAdmin)
const mobile = computed(() => uiStore.mobile)

const hoverEnter = ref(false)

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
  transition: all 0.3s ease-in-out;
}

.toolbar-content.enter,
.toolbar-content.hoverEnter {
  box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
}

.toolbar-content.enter {
  background: var(--mini-nav-mask);
  color: var(--white);
}

.toolbar-title {
  margin-left: 30px;
  cursor: pointer;
}

.toolbar-mobile-menu {
  font-size: 30px;
  margin-right: 15px;
  cursor: pointer;
}

.scroll-menu {
  margin: 0 25px 0 0;
  display: flex;
  justify-content: flex-end;
  padding: 0;
  align-items: center;
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
}
</style>
