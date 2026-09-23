<template>
  <div class="index-container">
    <!-- 导航栏 -->
    <NavBar />

    <div id="main-container">
      <router-view></router-view>
    </div>

    <MyFooter v-bind="footerCfg" />

    <!-- 浮动工具按钮 -->
    <FloatingTools :show="toolButton" @click="toTop" />

    <!-- 点击动画 -->
    <canvas v-if="uiStore.mouseAnimation" id="mousedown"
            style="position:fixed;left:0;top:0;pointer-events:none;z-index: 1000">
    </canvas>

    <!-- 图片预览 -->
    <div id="outerImg">
      <div id="innerImg" style="position:absolute">
        <img id="bigImg" src="" />
      </div>
    </div>

    <!-- 手机端抽屉导航 -->
    <el-drawer v-model="uiStore.toolbarDrawer"
               :show-close="false"
               size="65%"
               custom-class="toolbarDrawer"
               title="欢迎光临"
               direction="ltr">
      <div>
        <ul class="small-menu">
          <li @click="navigate({ path: '/' })">
            <div>🏡 <span>首页</span></div>
          </li>
          <li @click="navigate({ path: '/weiYan' })">
            <div>🏖️ <span>随笔</span></div>
          </li>
          <li>
            <div>📒 <span>记录</span></div>
            <div>
              <div v-for="(menu, index) in sortInfo" :key="index" class="sortMenu"
                   @click="navigate({ path: '/sort', query: { sortId: menu.id } })">
                {{ menu.name }}
              </div>
            </div>
          </li>
          <li @click="navigate({ path: '/love' })">
            <div>❤️‍🔥 <span>家</span></div>
          </li>
          <li @click="navigate({ path: '/favorite' })">
            <div>🧰 <span>百宝箱</span></div>
          </li>
          <li @click="navigate({ path: '/message' })">
            <div>📪 <span>留言</span></div>
          </li>
          <li v-if="adminLogin" @click="goAdmin({ path: '/admin' })">
            <div>💻️ <span>后台</span></div>
          </li>
          <template v-if="$common.isEmpty(userStore.currentUser)">
            <li @click="navigate({ path: '/user' })">
              <div>
                <el-icon style="margin-right: 8px; vertical-align: -2px;"><User /></el-icon>
                <span>&nbsp; 登录</span>
              </div>
            </li>
          </template>
          <template v-else>
            <li @click="navigate({ path: '/user' })">
              <div>
                <el-icon style="margin-right: 8px; vertical-align: -2px;"><User /></el-icon>
                <span>&nbsp;个人中心</span>
              </div>
            </li>
            <li @click="handleLogout()">
              <div>
                <el-icon style="margin-right: 8px; vertical-align: -2px;"><SwitchButton /></el-icon>
                <span>&nbsp;退出</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </el-drawer>

    <!-- 登录/注册弹窗 -->
    <AuthModal v-model="uiStore.showAuthModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import type { WatchStopHandle, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import { SwitchButton, User } from '@element-plus/icons-vue'
import { useUiStore } from '@/stores/modules/ui'
import { useAuthStore, useSortInfoStore, useSysConfigStore, useToolbarStore, useUserStore, useWebInfoStore } from '@/stores'
import { authApi, systemApi, webApi } from '@/api'
import MyFooter from '@/components/business/MyFooter.vue'
import { routeMeta } from '@/router/metaCfg'
import AuthModal from '@/components/business/auth/AuthModal.vue'
import NavBar from './components/NavBar.vue'
import FloatingTools from './components/FloatingTools.vue'
import type { CommonUtils } from '@/types'

const route: RouteLocationNormalizedLoaded = useRoute()
const router = useRouter()
const $common: CommonUtils = inject('$common')!

const uiStore = useUiStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const webInfoStore = useWebInfoStore()
const sysConfigStore = useSysConfigStore()
const sortInfoStore = useSortInfoStore()
const toolStore = useToolbarStore()

const scrollTop: Ref<number> = ref(0)
const toolButton: Ref<boolean> = ref(false)
const currBgImg: Ref<string> = ref('')

const adminLogin = computed(() => authStore.isAdmin)
const sortInfo = computed(() =>
  sortInfoStore.sortInfo.filter((item: any) => item.isShow !== 0),
)

const footerCfg = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    const key = route.matched[i].name
    if (key && typeof key === 'string' && routeMeta[key]) return routeMeta[key]
  }
  return undefined
})

let unwatchScrollTop: WatchStopHandle | null = null

onMounted(() => {
  getBgImg()
  toolStore.changeToolbarStatus({ enter: false, visible: true })
  getWebInfo()
  getSortInfo()
  getSysConfig()
  uiStore.setMobile(window.innerWidth < 1100)
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', onScrollPage)
  if (uiStore.mouseAnimation) import('../../utils/mousedown.js').then(m => m.default())
  unwatchScrollTop = watch(scrollTop, (newVal: number, oldVal: number) => {
    const enter = newVal > window.innerHeight / 2
    const top = newVal - oldVal < 0
    const isShow = newVal - window.innerHeight > 30
    toolButton.value = isShow
    toolStore.changeToolbarStatus({ enter, visible: top })
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', onScrollPage)
  if (unwatchScrollTop) unwatchScrollTop()
})

watch(() => uiStore.mouseAnimation, (val) => {
  if (val) import('../../utils/mousedown.js').then(m => m.default())
})

function getBgImg(): void {
  if (webInfoStore.webInfo?.randomCover?.length) {
    const src = webInfoStore.webInfo.randomCover[Math.floor(Math.random() * webInfoStore.webInfo.randomCover.length)]
    currBgImg.value = `url(${src})`
  }
}

function handleResize(): void {
  uiStore.setMobile(window.innerWidth < 1100)
}

function onScrollPage(): void {
  scrollTop.value = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
}

function navigate(to: RouteLocationRaw): void {
  router.push(to)
  uiStore.closeToolbarDrawer()
}

async function handleLogout(): Promise<void> {
  try {
    await authApi.logout()
    userStore.loadCurrentUser({})
    localStorage.removeItem('userToken')
    ElMessage.success('退出成功')
    await router.push({ path: '/' })
    uiStore.closeToolbarDrawer()
  } catch (error: any) {
    console.error('[logout error]', error)
    ElMessage.error(error?.message || '退出失败')
  }
}

function goAdmin(data: { path: string }): void {
  window.open(`${window.location.origin}${data.path}`)
}

function toTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function getWebInfo(): Promise<void> {
  try {
    const res = await webApi.getWebInfo()
    if (res && res.data && !$common.isEmpty(res.data)) {
      webInfoStore.loadWebInfo(res.data as any)
      localStorage.setItem('defaultStoreType', res.data.defaultStoreType || '')
    }
  } catch (error: any) {
    console.error('[getWebInfo error]', error)
    ElMessage.error(error?.message || '获取网站信息失败')
  }
}

async function getSysConfig(): Promise<void> {
  try {
    const res = await systemApi.getSysConfig()
    if (res && res.data && !$common.isEmpty(res.data)) {
      sysConfigStore.loadSysConfig(res.data)
    }
  } catch (error: any) {
    console.error('[getSysConfig error]', error)
    ElMessage.error(error?.message || '获取系统配置失败')
  }
}

async function getSortInfo(): Promise<void> {
  try {
    await sortInfoStore.loadHomeStats()
    await sortInfoStore.loadListNavBar()
  } catch (error: any) {
    console.error('[getSortInfo error]', error)
    ElMessage.error(error?.message || '获取分类信息失败')
  }
}
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background-image: v-bind(currBgImg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-blend-mode: overlay;
}

.toolbarDrawer {
  position: relative;
  background: var(--toolbar) center center / cover no-repeat;
  letter-spacing: 3px;
}

.toolbarDrawer .el-drawer__header {
  font-size: 22px;
  color: var(--white);
  text-align: center;
  position: relative;
}

.toolbarDrawer::before {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--maxMask);
  content: "";
}

.small-menu {
  color: var(--white);
  font-size: 20px;
  user-select: none;
  position: relative;
}

.small-menu > li {
  list-style: none;
  line-height: 40px;
  cursor: pointer;
}

.sortMenu {
  margin-left: 44px;
  font-size: 17px;
  position: relative;
}

.sortMenu:after {
  top: 32px;
  width: 35px;
  left: 0;
  height: 2px;
  background: var(--themeBackground);
  content: "";
  border-radius: 1px;
  position: absolute;
  transition: width 0.3s ease-in-out;
}

#outerImg {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  width: 100%;
  height: 100%;
  display: none;
}
</style>
