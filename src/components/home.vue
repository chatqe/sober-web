<template>
  <div>
    <!-- el过渡动画 -->
    <transition name="el-fade-in-linear">
      <!-- 导航栏 -->
      <div v-show="toolbar.visible|| ($common.mobile() || mobile)"
           @mouseenter="hoverEnter = true"
           @mouseleave="hoverEnter = false"
           :class="[{ enter: toolbar.enter }, { hoverEnter: (hoverEnter || route.path === '/favorite' || route.path === '/travel') && !toolbar.enter }]"
           class="toolbar-content myBetween">
        <!-- 网站名称 -->
        <div class="toolbar-title">
          <h2 @click="router.push({path: '/'})">{{ webInfoStore.webInfo?.webName }}</h2>
        </div>

        <!-- 手机导航按钮 -->
        <div v-if="$common.mobile() || mobile"
             class="toolbar-mobile-menu"
             @click="toolbarDrawer = !toolbarDrawer"
             :class="{ enter: toolbar.enter }">
          <i class="el-icon-s-operation"></i>
        </div>

        <!-- 导航列表 -->
        <div v-else>
          <ul class="scroll-menu">
            <li @click="router.push({path: '/'})">
              <div class="my-menu">
                🏡 <span>首页</span>
              </div>
            </li>

            <li @click="router.push({path: '/weiYan'})">
              <div class="my-menu">
                🏖️ <span>随笔</span>
              </div>
            </li>


            <el-dropdown popper-class="new-el-dropdown" :hide-timeout="500" placement="bottom">
              <li>
                <div class="my-menu">
                  📒 <span>记录</span>
                </div>
              </li>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(sort, index) in sortInfo" :key="index">
                    <div @click="router.push({path: '/sort', query: {sortId: sort.id}})">
                      {{ sort.sortName }}
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>


            <!-- 爱情买卖 -->
            <li @click="router.push({path: '/love'})">
              <div class="my-menu">
                <!--💋 <span>家</span>-->
                ❤️‍🔥 <span>家</span>
              </div>
            </li>

            <!-- 旅拍 -->
            <!--            <li @click="router.push({path: '/travel'})">-->
            <!--              <div class="my-menu">-->
            <!--                🌏 <span>旅拍</span>-->
            <!--              </div>-->
            <!--            </li>-->

            <!-- 百宝箱 -->
            <li @click="router.push({path: '/favorite'})">
              <div class="my-menu">
                🧰 <span>百宝箱</span>
              </div>
            </li>

            <!-- 聊天室 -->
            <!--                        <li @click="goIm()">-->
            <!--                          <div class="my-menu">-->
            <!--                            💬 <span>联系我</span>-->
            <!--                          </div>-->
            <!--                        </li>-->
            <!-- 留言 -->
            <li @click="router.push({path: '/message'})">
              <div class="my-menu">
                📪 <span>留言</span>
              </div>
            </li>
            <!-- 友人帐 -->
            <!--            <li @click="router.push({path: '/friend'})">-->
            <!--              <div class="my-menu">-->
            <!--                💃 <span>友人帐</span>-->
            <!--              </div>-->
            <!--            </li>-->

            <!-- 关于 -->
            <!--            <li @click="router.push({path: '/about'})">-->
            <!--              <div class="my-menu">-->
            <!--                🐟 <span>关于</span>-->
            <!--              </div>-->
            <!--            </li>-->

            <!-- 后台 -->
            <li v-if="adminLogin" @click="goAdmin({path: '/admin'})">
              <div class="my-menu">
                💻️ <span>后台</span>
              </div>
            </li>

            <!-- 个人中心 -->
            <li>
              <el-dropdown placement="bottom">
                <el-avatar class="user-avatar" :size="36"
                           style="margin-top: 12px"
                           :src="!$common.isEmpty(userStore.currentUser)?userStore.currentUser.avatar:webInfoStore.webInfo?.avatar">
                </el-avatar>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="router.push({path: '/user'})"
                                      v-if="!$common.isEmpty(userStore.currentUser)">
                      <i class="fa fa-user-circle" aria-hidden="true"></i> <span>个人中心</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="logout()" v-if="!$common.isEmpty(userStore.currentUser)">
                      <i class="fa fa-sign-out" aria-hidden="true"></i> <span>退出</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="router.push({path: '/user'})"
                                      v-if="$common.isEmpty(userStore.currentUser)">
                      <i class="fa fa-sign-in" aria-hidden="true"></i> <span>登陆</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </div>
    </transition>


    <div id="main-container">
      <router-view></router-view>
    </div>

    <!-- 回到顶部按钮 -->
    <!--    <div href="#" class="cd-top" v-if="!$common.mobile()" @click="toTop()"></div>-->

    <div class="toolButton">
      <div class="backTop" v-if="toolButton" @click="toTop()">
        <!-- 回到顶部按钮 -->
        <svg viewBox="0 0 1024 1024" width="50" height="50">
          <path
              d="M696.741825 447.714002c2.717387-214.485615-173.757803-312.227566-187.33574-320.371729-10.857551 5.430775-190.050127 103.168727-187.33274 320.371729-35.297037 24.435488-73.306463 65.1623-67.875688 135.752376 5.430775 70.589076 76.018851 119.460051 103.168726 116.745664 27.152875-2.716387 19.004713-21.7221 19.004713-21.7221l8.148162-38.011425s40.721814 59.732525 51.583363 59.732525h146.609927c13.574938 0 51.585363-59.732525 51.585363-59.732525l8.147162 38.011425s-8.147162 19.005713 19.004713 21.7221c27.148876 2.714388 97.738951-46.156588 103.168727-116.745664s-32.57965-111.316888-67.876688-135.752376z m-187.33574-2.713388c-5.426776 0-70.589076-2.717387-78.733239-78.737238 2.713388-73.306463 73.306463-78.733239 78.733239-81.450626 5.430775 0 76.02385 8.144163 78.736238 81.450626-8.143163 76.019851-73.305463 78.737238-78.736238 78.737238z m0 0"
              fill="#000000"></path>
          <path
              d="M423.602441 746.060699c6.47054-6.297579 12.823107-7.017417 21.629121-2.784372 34.520213 16.582259 70.232157 19.645568 107.031855 9.116944 8.118169-2.323476 15.974396-5.475765 23.598677-9.22392 13.712907-6.73648 26.003134 0.8878 26.080116 16.13936 0.109975 22.574907-0.024994 45.142816 0.080982 67.709725 0.031993 7.464316-2.277486 13.322995-9.44387 16.608254-7.277358 3.333248-13.765895 1.961558-19.526595-3.264264-3.653176-3.313253-7.063407-6.897444-10.634601-10.304675-6.563519-6.259588-6.676494-6.25259-10.625603 1.603638-8.437097 16.80121-16.821205 33.623415-25.257302 50.423625-2.489438 4.953882-5.706713 9.196925-11.411426 10.775569-8.355115 2.315478-15.772442-1.070758-20.272427-9.867774-8.774021-17.15313-17.269104-34.453228-25.918153-51.669344-3.750154-7.469315-3.9891-7.479313-10.141712-1.514658-3.715162 3.602187-7.31435 7.326347-11.142486 10.800563-5.571743 5.060858-11.934308 6.269586-18.936728 3.207277-6.82746-2.984327-9.869774-8.483086-9.892769-15.685462-0.070984-23.506697-0.041991-47.018393-0.020995-70.532089 0.007998-4.679944 1.46467-8.785018 4.803916-11.538397z"
              fill="#000000"></path>
        </svg>
      </div>


      <el-popover placement="left"
                  :close-delay="500"
                  trigger="hover">
        <template #reference>
          <div>
            <i class="fa fa-cog iconRotate" style="color: var(--black)" aria-hidden="true"></i>
          </div>
        </template>
        <div class="my-setting">
          <div>
            <!-- 太阳按钮 -->
            <i v-if="isDark" class="el-icon-sunny iconRotate" @click="changeColor()"></i>
            <!-- 月亮按钮 -->
            <i v-else class="fa fa-moon-o" aria-hidden="true" @click="changeColor()"></i>
          </div>
          <div>
            <i class="fa fa-snowflake-o" aria-hidden="true" @click="changeMouseAnimation()"></i>
          </div>
        </div>
      </el-popover>
    </div>

    <aPlayer></aPlayer>

    <!--   <div id="aplayer"></div>-->

    <!-- 点击动画 -->
    <canvas v-if="mouseAnimation" id="mousedown"
            style="position:fixed;left:0;top:0;pointer-events:none;z-index: 1000">
    </canvas>

    <!-- 图片预览 -->
    <div id="outerImg">
      <div id="innerImg" style="position:absolute">
        <img id="bigImg" src=""/>
      </div>
    </div>


    <!--    手机端-->
    <el-drawer v-model="toolbarDrawer"
               :show-close="false"
               size="65%"
               custom-class="toolbarDrawer"
               title="欢迎光临"
               direction="ltr">
      <div>
        <ul class="small-menu">
          <li @click="smallMenu({path: '/'})">
            <div>
              🏡 <span>首页</span>
            </div>
          </li>

          <li @click="router.push({path: '/weiYan'})">
            <div class="my-menu">
              🏖️ <span>随笔</span>
            </div>
          </li>


          <li>
            <div>
              📒 <span>记录</span>
            </div>
            <div>
              <div v-for="(menu, index) in sortInfo"
                   :key="index"
                   class="sortMenu"
                   @click="smallMenu({path: '/sort', query: {sortId: menu.id}})">
                {{ menu.sortName }}
              </div>
            </div>
          </li>

          <!-- 爱情买卖 -->
          <li @click="smallMenu({path: '/love'})">
            <div>
              ❤️‍🔥 <span>家</span>
            </div>
          </li>

          <!-- 旅拍 -->
          <!--          <li @click="smallMenu({path: '/travel'})">-->
          <!--            <div>-->
          <!--              🌏 <span>旅拍</span>-->
          <!--            </div>-->
          <!--          </li>-->

          <!-- 百宝箱 -->
          <li @click="smallMenu({path: '/favorite'})">
            <div>
              🧰 <span>百宝箱</span>
            </div>
          </li>

          <!-- 聊天室 -->
          <!--          <li @click="goIm()">-->
          <!--            <div>-->
          <!--              💬 <span>非礼勿言</span>-->
          <!--            </div>-->
          <!--          </li>-->
          <!-- 留言 -->
          <li @click="smallMenu({path: '/message'})">
            <div>
              📪 <span>留言</span>
            </div>
          </li>
          <!-- 友人帐 -->
          <!--          <li @click="smallMenu({path: '/friend'})">-->
          <!--            <div>-->
          <!--              💃 <span>友人帐</span>-->
          <!--            </div>-->
          <!--          </li>-->

          <!-- 关于 -->
          <!--          <li @click="smallMenu({path: '/about'})">-->
          <!--            <div>-->
          <!--              🐟 <span>关于</span>-->
          <!--            </div>-->
          <!--          </li>-->

          <!-- 后台 -->
          <li v-if="adminLogin" @click="goAdmin({path: '/admin'})">
            <div>
              💻️ <span>后台</span>
            </div>
          </li>

          <template v-if="$common.isEmpty(userStore.currentUser)">
            <li @click="smallMenu({path: '/user'})">
              <div>
                <i class="fa fa-sign-in" aria-hidden="true"></i>
                <span>&nbsp; 登录</span>
              </div>
            </li>
          </template>
          <template v-else>
            <li @click="smallMenu({path: '/user'})">
              <div>
                <i class="fa fa-user-circle" aria-hidden="true"></i>
                <span>&nbsp;个人中心</span>
              </div>
            </li>
            <li @click="smallMenuLogout()">
              <div>
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span>&nbsp;退出</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, onUnmounted, nextTick, inject, watch} from 'vue'
import {useRoute} from 'vue-router'
import router from '@/router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useUserStore, useWebInfoStore, useSystemStore, useSortInfoStore, useAuthStore} from '@/stores'
import aPlayer from './common/aPlayer.vue'
import mousedown from '../utils/mousedown'

// API模块导入
import {userApi, webApi, systemApi} from '@/api'

const route = useRoute()
const $common = inject('$common')
const $constant = inject('$constant')
const userStore = useUserStore()
const authStore = useAuthStore()
const webInfoStore = useWebInfoStore()
const systemStore = useSystemStore()
const sortInfoStore = useSortInfoStore()

// 响应式数据
const hoverEnter = ref(false)
const mobile = ref(false)
const scrollTop = ref(0)
const isDark = ref(false)
const toolbarDrawer = ref(false)
const mouseAnimation = ref(false)
const toolButton = ref(false)
const adminLogin = authStore.isAdmin

// 初始化数据
onMounted(() => {
  // 设置工具栏状态
  systemStore.changeToolbarStatus({enter: false, visible: true})

  // 初始化数据
  getWebInfo()
  getSortInfo()
  getSysConfig()

  // 响应式处理
  mobile.value = window.innerWidth < 1100

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', onScrollPage)

  // 初始化暗黑模式
  if (isDaylight()) {
    isDark.value = true
    setupDarkMode()
  }

  // 初始化鼠标动画
  if (mouseAnimation.value) {
    mousedown()
  }

  // 监听滚动条变化
  unwatchScrollTop = watch(scrollTop, (newVal, oldVal) => {
    // 如果滑动距离超过屏幕高度三分之一视为进入页面，背景改为白色
    let enter = newVal > window.innerHeight / 2
    const top = newVal - oldVal < 0
    let isShow = newVal - window.innerHeight > 30
    toolButton.value = isShow

    // 导航栏显示与颜色
    let toolbarStatus = {
      enter: enter,
      visible: top,
    }
    systemStore.changeToolbarStatus(toolbarStatus)
  })
})

// 处理窗口大小变化
const handleResize = () => {
  mobile.value = window.innerWidth < 1100
}

// 处理滚动
const onScrollPage = () => {
  scrollTop.value = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
}

// 设置暗黑模式
const setupDarkMode = () => {
  let root = document.querySelector(':root')
  root.style.setProperty('--background', '#272727')
  root.style.setProperty('--fontColor', 'white')
  root.style.setProperty('--borderColor', '#4F4F4F')
  root.style.setProperty('--borderHoverColor', 'black')
  root.style.setProperty('--articleFontColor', '#E4E4E4')
  root.style.setProperty('--articleGreyFontColor', '#D4D4D4')
  root.style.setProperty('--commentContent', '#D4D4D4')
  root.style.setProperty('--favoriteBg', '#1e1e1e')
}

// 计算属性
const toolbar = computed(() => {
  return systemStore.toolbar
})

const sortInfo = computed(() => {
  let showSort = systemStore.sortInfo.filter(item => item.status !== 0)
  return showSort
})

// 监听滚动条变化
let unwatchScrollTop = null

// 清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', onScrollPage)
  // 正确清理 watcher
  if (unwatchScrollTop) {
    unwatchScrollTop()
  }
})
// 方法定义
const smallMenu = (data) => {
  router.push(data)
  toolbarDrawer.value = false
}

const smallMenuLogout = () => {
  logout()
  toolbarDrawer.value = false
}

const goAdmin = (data) => {
  if (!$constant || !$constant.webURL) {
    ElMessage.error('后台地址未配置')
    return
  }
  window.open($constant.webURL + data.path)
}

const goIm = () => {
  if ($common.isEmpty(userStore.currentUser)) {
    ElMessage.error('请先登录！')
  } else {
    let userToken = $common.encrypt(localStorage.getItem('userToken'))
    window.open($constant.imBaseURL + '?userToken=' + userToken + '&defaultStoreType=' + localStorage.getItem('defaultStoreType'))
    console.log($constant.imBaseURL + '?userToken=' + userToken + '&defaultStoreType=' + localStorage.getItem('defaultStoreType'))
  }
}

const logout = async () => {
  try {
    await userApi.logout()
    userStore.loadCurrentUser({})
    localStorage.removeItem('userToken')
    ElMessage.success('退出成功')
    router.push({path: '/'})
  } catch (error) {
    console.error('[logout error]', error)
    ElMessage.error(error?.message || '退出失败')
  }
}

const getWebInfo = async () => {
  try {
    const res = await webApi.getWebInfo()
    if (res && res.data && !$common.isEmpty(res.data)) {
      webInfoStore.loadWebInfo(res.data)
      localStorage.setItem('defaultStoreType', res.data.defaultStoreType || '')
    }
  } catch (error) {
    console.error('[getWebInfo error]', error)
    ElMessage.error(error?.message || '获取网站信息失败')
  }
}

const getSysConfig = async () => {
  try {
    // const res = await systemApi.listSysConfig()
    const res = await systemApi.getSysConfig()
    if (res && res.data && !$common.isEmpty(res.data)) {
      systemStore.loadSysConfig(res.data)
      // buildCssPicture()
    }
  } catch (error) {
    console.error('[getSysConfig error]', error)
    ElMessage.error(error?.message || '获取系统配置失败')
  }
}

const getSortInfo = async () => {
  try {
    const res = await webApi.getSortInfo()
    if (res && res.data && !$common.isEmpty(res.data)) {
      sortInfoStore.loadSortInfo(res.data)
    }
  } catch (error) {
    console.error('[getSortInfo error]', error)
    ElMessage.error(error?.message || '获取分类信息失败')
  }
}
const buildCssPicture = () => {
  let root = document.querySelector(':root')
  if (!$common.isEmpty(systemStore.sysConfig)) {
    if (!$common.isEmpty(systemStore.sysConfig.styleBgColor)) {
      root.style.setProperty('--styleBgColor', systemStore.sysConfig.styleBgColor)
    }
    if (!$common.isEmpty(systemStore.sysConfig.styleTextColor)) {
      root.style.setProperty('--styleTextColor', systemStore.sysConfig.styleTextColor)
    }
    if (!$common.isEmpty(systemStore.sysConfig.styleTitleColor)) {
      root.style.setProperty('--styleTitleColor', systemStore.sysConfig.styleTitleColor)
    }
    if (!$common.isEmpty(systemStore.sysConfig.styleBorderColor)) {
      root.style.setProperty('--styleBorderColor', systemStore.sysConfig.styleBorderColor)
    }
    if (!$common.isEmpty(systemStore.sysConfig.styleCardBgColor)) {
      root.style.setProperty('--styleCardBgColor', systemStore.sysConfig.styleCardBgColor)
    }
  }
}
const changeColor = () => {
  if ($common.isEmpty(userStore.currentUser)) {
    ElMessage.error('请先登录！')
    return
  }
  ElMessageBox.prompt('请输入颜色代码，如：#333333', '自定义背景色', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^#[0-9A-Fa-f]{6}$/,
    inputErrorMessage: '请输入正确的颜色代码！'
  }).then(async ({value}) => {
    try {
      await systemApi.setSysConfig({type: 'styleBgColor', value})
      ElMessage.success('设置成功！')
      getSysConfig()
    } catch (error) {
      console.error('[changeColor error]', error)
      ElMessage.error(error?.message || '设置颜色失败')
    }
  }).catch(() => {
    // 取消操作
  })
}

const toTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

const isDaylight = () => {
  let currDate = new Date();
  if (currDate.getHours() > 22 || currDate.getHours() < 7) {
    // return true; 关闭自动切换为夜晚模式
    return false;
  } else {
    return false;
  }
}

const changeMouseAnimation = () => {
  mouseAnimation.value = !mouseAnimation.value;
  if (mouseAnimation.value) {
    nextTick(() => {
      mousedown();
    });
  }
}
</script>

<style scoped>


.toolbar-content {
  width: 100%;
  height: 60px;
  color: var(--white);
  /* 禁止选中文字 */
  user-select: none;
  transition: all 0.3s ease-in-out;
}

.toolbar-content.enter,
.toolbar-content.hoverEnter {
  box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
}

.toolbar-content.enter {
  background: var(--toolbarBackground);
  color: var(--toolbarFont);
}

.toolbar-content.hoverEnter {
  background: var(--translucent);
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
  content: "";
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


.toolButton {
  right: 3vh;
  bottom: 3vh;
  animation: slide-bottom 0.5s ease-in-out both;
  cursor: pointer;
  font-size: 25px;
  width: 30px;
}

.my-setting {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  cursor: pointer;
  font-size: 20px;
}

.my-setting i {
  padding: 5px;
}

.my-setting i:hover {
  color: var(--themeBackground);
}

/* 固定定位元素通用样式 */
.toolbar-content,
.toolButton,
.cd-top {
  position: fixed;
  z-index: 100;
}

.cd-top {
  background: var(--toTop) no-repeat center;
  right: 5vh;
  top: -900px;
  z-index: 99;
  width: 70px;
  height: 900px;
  background-size: contain;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}

.backTop {
  transition: all 0.3s ease-in;
  position: relative;
  top: 0;
  left: -13px;
}

.backTop:hover {
  top: -10px;
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

@media screen and (max-width: 400px) {
  .toolButton {
    right: 0.5vh;
  }
}
</style>
