<script setup>
import {computed, defineAsyncComponent, inject, onMounted, onUnmounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useAuthStore, useUserStore, useWebInfoStore} from '@/stores'
import {authApi, userApi} from '@/api/index.js'
import {EmailBizType} from "@/constant/index.js";

const router = useRouter()

// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

// 异步导入组件
const proButton = defineAsyncComponent(() => import("../../base/ProButton.vue"))
const uploadPicture = defineAsyncComponent(() => import("../../media/UploadPicture.vue"))

// 状态管理
// ... existing code ...
const userStore = useUserStore()
const webInfoStore = useWebInfoStore()
const authStore = useAuthStore()

// 背景图片
const bgImg = webInfoStore.webInfo.randomCover[Math.floor(Math.random() * webInfoStore.webInfo.randomCover.length)]

// 登录参数
const account = ref("")
const loginPwd = ref("")
// 注册参数
const username = ref("")
const registPwd = ref("")
const code = ref("")
const phoneNum = ref("")
const email = ref("")
const avatar = ref("")
const password = ref("") // 新增密码变量，用于对话框
const showDialog = ref(false)
const showRegist = ref(false)
const dialogTitle = ref("")
const codeString = ref("验证码")
const pwdFlag = ref(null)
const isLogin = ref(true)
let intervalCode = null
const captchaShow = ref(false)
const captchaImg = ref('')
const verifyuuid = ref('')
const captcha = ref('')
const changeFlag = ref({
  forgetPwd: false, // 忘记密码
  register: false,
  bindPhone: false,
  bindEmail: false,
  changePhone: false,
  changeEmail: false,
})
const showPwd = ref(false)
const showFgtPwd = ref(false)

// 计算属性
const currentUser = computed(() => userStore.currentUser)
const webInfo = computed(() => webInfoStore.webInfo)

const visible = defineModel()

// 关闭模态框函数
function close() {
  visible.value = false
}

// ESC键处理函数
function handleKeydown(event) {
  if (event.key === 'Escape') {
    close()
  }
}

// 组件挂载时初始化
onMounted(() => {
  // 添加ESC键支持
  document.addEventListener('keydown', handleKeydown)
})

// 组件销毁时清理
onUnmounted(() => {
  // 移除ESC键事件监听
  document.removeEventListener('keydown', handleKeydown)
  // 确保滚动锁被移除
  toggleLock(false)
})

// 实现大厂标准的滚动锁函数 - 只使用CSS overflow: hidden
// 全局变量存储滚动位置
let oldScrollTop = 0;

function toggleLock(on) {
  if (on) {
    // 记录滚动位置
    oldScrollTop = window.pageYOffset;    // 同时锁body和html元素
    // 设置body的top为负的滚动位置，视觉上保持背景位置不变
    document.body.style.top = `-${oldScrollTop}px`;
    document.body.classList.add('lock-scroll')
    document.documentElement.classList.add('lock-scroll')
    console.log('滚动锁已添加') // 调试日志
  } else {
    // 移除滚动锁
    document.body.classList.remove('lock-scroll')
    document.documentElement.classList.remove('lock-scroll')
    // 恢复滚动位置
    window.scrollTo({
      top: oldScrollTop,
      behavior: 'instant' // 瞬间恢复，无动画
    });
    console.log('滚动锁已移除') // 调试日志
  }
}

/* 立即执行：打开就锁，关闭就解 */
watch(() => visible.value, toggleLock, {immediate: true})
// watch(
//     () => visible.value,
//     v => {
//       console.log('visible =>', v)   // ← 打印最新值
//       console.log('--scoll-top', document.body.style.getPropertyValue('--scroll-top'))
//       toggleLock(v)                  // ← 继续原逻辑
//     },
//     { immediate: true }
// )
const captchaClose = () => {
  // console.log("关闭验证码对话框")
  captchaShow.value = false
}
const captchaSubCancel = () => {
  captchaClose()
  captcha.value = ''
}
const captchaSubConfirm = async () => {
  if ($common.isEmpty(email.value)) {
    ElMessage.error("请输入邮箱验证码!")
    return
  }

  if ($common.isEmpty(captcha.value)) {
    ElMessage.error("请输入图形验证码！")
    return
  }

  const res = await authApi.captchaCheck({uuid: verifyuuid.value, code: captcha.value})
  if (!res) {
    ElMessage.error("验证码错误！")

  } else {
    captchaClose()
    captcha.value = ''
    dialogTitle.value = "邮箱验证码"
    let params = {}
    if (!checkParams(params)) return
    // console.log('params:', params)
    const res = await authApi.emailCode(params)
    ElMessage.success("验证码已发送，请注意查收！")
  }
  // console.log('res:', res)
}
// 新切换登录/注册面板
const changeLoginCard = () => {
  isLogin.value = !isLogin.value
}

// 新切换对话框
const changeDialog1 = () => {
  changeFlag.value.forgetPwd = true

  // if ($common.isEmpty(email.value)) {
  //   ElMessage({
  //     message: "请输入邮箱！",
  //     type: "error"
  //   })
  //   return false
  // }
  // if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(email.value))) {
  //   ElMessage({
  //     message: "邮箱格式有误！",
  //     type: "error"
  //   })
  //   return false
  // }


  // dialogTitle.value = value
  // showDialog.value = true
}

// 登录
const login = async () => {
  if ($common.isEmpty(account.value) || $common.isEmpty(loginPwd.value)) {
    ElMessage({
      message: "请输入账号或密码！",
      type: "error"
    })
    return
  }

  let user = {
    account: account.value.trim(),
    password: $common.encrypt(loginPwd.value.trim())
  }

  try {
    const res = await authApi.login(user)
    if (!$common.isEmpty(res)) {
      userStore.loadCurrentUser(res)
      authStore.setUserToken(res.accessToken)
      if (res.isAdmin) {
        authStore.setIsAdmin(true)
      }
      account.value = ""
      loginPwd.value = ""
      close()
      await router.push({path: '/'})
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}
// 注册
const register = async () => {
  if ($common.isEmpty(username.value) || $common.isEmpty(registPwd.value)) {
    ElMessage({
      message: "请输入用户名或密码！",
      type: "error"
    })
    return
  }

  if (dialogTitle.value === "邮箱验证码" && $common.isEmpty(email.value)) {
    ElMessage({
      message: "请输入邮箱！",
      type: "error"
    })
    return false
  }

  if ($common.isEmpty(code.value)) {
    ElMessage({
      message: "请输入验证码！",
      type: "error"
    })
    return
  }

  if (username.value.indexOf(" ") !== -1 || registPwd.value.indexOf(" ") !== -1) {
    ElMessage({
      message: "用户名或密码不能包含空格！",
      type: "error"
    })
    return
  }

  let user = {
    username: username.value.trim(),
    code: code.value.trim(),
    password: $common.encrypt(registPwd.value.trim()),
    email: email.value.trim(),
  }

  try {
    const res = await userApi.register(user)
    if (!$common.isEmpty(res)) {
      userStore.loadCurrentUser(res)
      authStore.setUserToken(res.accessToken)
      username.value = ""
      registPwd.value = ""
      code.value = ""
      email.value = ""
      close()
      await router.push({path: '/'})
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 获取验证码
const getCode = async () => {
  if (!verifyEmail()) return
  captchaShow.value = true
  const res = await authApi.getCaptchaCode({flag: true, email: email.value})
  captchaImg.value = res.img
  verifyuuid.value = res.uuid
}

const verifyEmail = () => {
  if ($common.isEmpty(email.value)) {
    ElMessage({
      message: "请输入邮箱！",
      type: "error"
    })
    return false
  }
  if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(email.value))) {
    ElMessage({
      message: "邮箱格式有误！",
      type: "error"
    })
    return false
  }
  return true
}

const verifyCode = () => {
  if ($common.isEmpty(code.value)) {
    ElMessage.error("请输入验证码！")
    return false
  }
  if (code.value.length < 6) {
    ElMessage.error("验证码长度有误！")
    return false
  }
  return true
}

const fwdClose = () => {
  changeFlag.value.forgetPwd = false
  showFgtPwd.value = false
  username.value = ""
  registPwd.value = ""
  code.value = ""
  email.value = ""
}

const emailCode = async (bizType) => {
  if (!verifyEmail()) return
  const res = await authApi.emailCode({email: email.value, bizType})
  ElMessage.success("验证码已发送，请注意查收！")
}

const resetPwdForFgtPwd = async () => {
  if (!verifyEmail()) return
  if ($common.isEmpty(registPwd.value)) {
    ElMessage({
      message: "请输入密码！",
      type: "error"
    })
    return
  }
  if (!verifyCode()) return
  const res = await userApi.resetPwdForFgtPwd({
    email: email.value,
    password: $common.encrypt(registPwd.value.trim()),
    code: code.value,
    bizType: EmailBizType.RESET_PWD
  })
  if (!$common.isEmpty(res)) {
    ElMessage.success("修改成功，请重新登陆！")
    fwdClose()
  }
}

</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="backdrop-overlay" @click.self="void 0">
        <div class="auth-container">
          <!-- 添加关闭按钮 -->
          <div class="auth-close" @click="close">×</div>
          <div class="sign-box">
            <div class="myCenter sign-box__header">
              <h2>青肆</h2>
              <!--<h2>欢迎回来</h2>-->
            </div>

            <div v-if="isLogin">
              <div class="sign-box__body">
                <div class="sign-box__title">登录</div>
                <div class="sign-box__button" @click="changeLoginCard">没有账号？立即注册 &gt;</div>
              </div>

              <div class="sign-box__form">
                <div>
                  <div>
                    <div class="line-form">
                      <input v-model="account" type="text" placeholder="用户名/邮箱"
                             class="line-form-input">
                    </div>
                    <div class="line-form eye-pos" style="margin-top: 20px;">
                      <input v-model="loginPwd" autocomplete="current-password"
                             :type="showPwd ? 'text' : 'password'"
                             placeholder="登录密码"
                             class="line-form-input">
                      <IconEpHide class="pwd-eye" v-if="showPwd" @click="showPwd=!showPwd"></IconEpHide>
                      <IconEpView class="pwd-eye" v-else @click="showPwd=!showPwd"></IconEpView>

                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                      <div class="account-login-btn" @click="changeDialog1">忘记密码</div>
                      <div class="account-login-btn" @click="changeDialog1">免密登录</div>
                    </div>
                  </div>

                  <div class="login-btn" @click="login()">
                    <i aria-hidden="true"></i> 登录
                  </div>
                </div>

                <div class="social-separator">社交账号登录</div>

                <div class="social-loginbar">
                  <div class="social-loginbar-item">
                    <i style="vertical-align: middle;">
                      <svg viewBox="0 0 1024 1024" width="30" height="30">
                        <path
                            d="M512 21.12c-271.488 0-491.52 220.032-491.52 491.52s220.032 491.52 491.52 491.52 491.52-220.032 491.52-491.52-220.032-491.52-491.52-491.52z m267.392 630.144c-4.096 11.776-9.856 17.792-17.28 17.792-1.92 0-3.84-0.768-6.016-2.304-2.176-1.536-4.096-3.328-5.888-5.504-1.792-2.048-3.712-4.736-5.888-8.064-2.176-3.328-3.84-6.016-4.992-8.192-1.152-2.176-2.56-4.864-4.224-8.064-1.664-3.2-2.56-4.992-2.816-5.504-0.256-0.256-0.512-0.256-0.896-0.256l-1.536 1.28c-12.288 32-25.984 55.168-41.088 69.504 4.096 4.096 10.496 8.192 19.2 12.032s15.744 8.192 21.504 12.928c5.76 4.736 9.344 11.52 11.008 20.224-0.384 0.768-0.896 2.432-1.28 4.992-0.384 2.432-1.152 4.352-2.176 5.632-13.312 20.096-44.672 30.208-94.08 30.208-11.008 0-22.528-0.896-34.432-2.816-11.904-1.92-22.144-3.968-30.464-6.272-8.448-2.304-19.2-5.376-32.512-9.344-3.072-1.024-5.504-1.792-7.168-2.176-2.944-0.768-7.68-1.28-14.336-1.408s-10.752-0.256-12.416-0.512c-8.448 9.344-21.76 16.128-39.68 20.224-17.92 4.096-35.456 6.272-52.48 6.272-7.296 0-14.464-0.128-21.504-0.512-7.04-0.256-16.768-1.28-28.928-2.816-12.288-1.536-22.784-3.712-31.488-6.4-8.704-2.688-16.384-6.912-23.168-12.416-6.784-5.632-10.112-12.288-10.112-19.968 0-8.32 1.024-14.464 3.072-18.56 2.048-4.096 6.272-9.088 12.8-15.104 2.304-0.384 6.528-1.792 12.672-4.096 6.144-2.304 11.264-3.584 15.36-3.712 0.768 0 2.304-0.256 4.352-0.64 0.384-0.384 0.64-0.896 0.64-1.28l-0.64-0.896c-9.984-2.304-21.12-13.184-33.664-32.896-12.416-19.584-20.096-35.84-22.784-48.768l-1.536-0.896c-0.768 0-2.048 2.048-3.712 6.272-3.712 8.448-9.344 16.256-17.024 23.168-7.552 6.912-15.616 10.88-24.192 11.648h-0.256c-0.768 0-1.408-0.512-1.92-1.408-0.384-0.896-0.896-1.536-1.536-1.664-4.736-11.264-7.168-21.632-7.168-31.104 0-57.088 26.112-105.472 78.464-145.152-1.664-3.968-2.432-9.344-2.432-16.256 0-4.096 1.152-9.216 3.456-15.232s4.736-10.752 7.424-13.952c-0.256-4.608 0.512-10.112 2.304-16.512s4.096-10.88 7.04-13.44c0-28.8 9.6-58.752 28.8-89.856 19.2-31.104 41.728-52.736 67.712-65.28 28.8-13.696 62.464-20.608 100.864-20.608 27.648 0 55.168 5.76 82.816 17.152 10.24 4.352 19.584 9.344 28.032 14.976 8.448 5.632 15.872 11.392 22.144 17.408s11.904 13.056 17.152 21.12c5.248 8.064 9.6 15.744 13.056 23.04s6.912 16 10.112 26.368c3.2 10.24 5.888 19.584 7.936 27.904s4.352 18.432 6.912 30.464l0.256 1.536c11.392 17.28 17.152 32.768 17.152 46.72 0 2.944-0.896 7.04-2.816 12.416-1.92 5.376-2.816 9.344-2.816 11.776 0 0.256 0.128 0.512 0.512 1.152 0.256 0.512 0.64 1.024 1.152 1.536 0.384 0.512 0.64 0.896 0.64 1.152 16 23.68 28.544 45.952 37.504 66.816 9.088 20.864 13.568 42.496 13.568 64.896-0.256 8.96-2.304 19.328-6.272 31.232z"
                            fill="#EC502B"></path>
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 注册 -->
            <div v-else>
              <div class="sign-box__body">
                <div class="sign-box__title">注册</div>
                <div class="sign-box__button" @click="changeLoginCard">已有账号？立即登录 &gt;</div>
              </div>
              <div>
                <div>
                  <div class="line-form">
                    <input v-model="username" type="text" maxlength="30" placeholder="用户名"
                           class="line-form-input">
                  </div>
                  <div class="line-form eye-pos" style="margin-top: 20px;">
                    <input v-model="registPwd"
                           :type="showPwd ? 'text' : 'password'"
                           autocomplete="new-password"
                           maxlength="30"
                           placeholder="登录密码"
                           class="line-form-input">
                    <IconEpHide class="pwd-eye" v-if="showPwd" @click="showPwd=!showPwd"></IconEpHide>
                    <IconEpView class="pwd-eye" v-else @click="showPwd=!showPwd"></IconEpView>
                  </div>
                  <div class="line-form" style="margin-top: 20px;">
                    <input v-model="email"
                           type="text"
                           placeholder="邮箱"
                           class="line-form-input">
                  </div>
                  <div class="line-form" style="margin-top: 20px; position: relative;">
                    <input v-model="code" autocomplete="off" type="text" placeholder="验证码"
                           class="line-form-input">
                    <button class="send-btn" @click="getCode">验证码</button>
                  </div>
                </div>
                <div class="login-btn" @click="register"
                     style="background: linear-gradient(135deg, rgb(96, 228, 100) 10%, rgb(92, 184, 91) 100%);">
                  <i aria-hidden="true"></i> 注册
                </div>
              </div>
            </div>

            <!-- 忘记密码容器 -->


          </div>

          <!--图形验证码弹层-->
          <el-dialog v-model="captchaShow"
                     :modal="false"
                     :modal-penetrable="true"
                     width="25%"
                     title="图形验证码"
                     center
                     align-center

                     :before-close="captchaClose">

            <div class="captcha-container myCenter ">
              <div style="margin: 20px auto;">
                <div>
                  <el-image class="my-el-image captcha-image"
                            lazy
                            :src="captchaImg"
                            fit="cover"/>
                </div>
                <div>
                  <el-input v-model="captcha" size="large" autocomplete="off"/>
                </div>
              </div>

              <!--底部按钮-->
              <div class="myCenter">
                <proButton style="margin-right: 20px;"
                           :info="'取消'"
                           @click="captchaSubCancel"
                           :before="$constant.before_color_1"
                           :after="$constant.after_color_2"/>
                <proButton :info="'确定'"
                           @click="captchaSubConfirm"
                           :before="$constant.before_color_2"
                           :after="$constant.after_color_2"/>
              </div>
            </div>
          </el-dialog>

          <!-- 忘记密码容器 -->
          <div v-if="changeFlag.forgetPwd" class="ground-glass-bg fwd-body">
            <div style="font-size: 20px;margin-top: 10px;">忘记密码</div>
            <div class="fwd-close" @click="fwdClose">❌︎</div>

            <div class="fwd-input-box">
              <div>邮箱</div>
              <input v-model="email"
                     type="text"
                     class="fwd-input ">
            </div>


            <div class="fwd-input-box eye-pos">
              <div>新密码</div>
              <input v-model="registPwd"
                     :type="showFgtPwd ? 'text' : 'password'"
                     autocomplete="new-password"
                     maxlength="30"
                     class="fwd-input">
              <IconEpHide class="pwd-eye" style="top:25px" v-if="showFgtPwd"
                          @click="showFgtPwd=!showFgtPwd"></IconEpHide>
              <IconEpView class="pwd-eye" style="top:25px" v-else @click="showFgtPwd=!showFgtPwd"></IconEpView>
            </div>

            <div class="fwd-input-box">
              <div>验证码</div>
              <div style=" position: relative;">
                <input v-model="code" autocomplete="off" type="text"
                       class="fwd-input">
                <button class="send-btn" @click="emailCode(EmailBizType.RESET_PWD)" style="height: 100%;right: 1px;">
                  发送
                </button>
              </div>
            </div>

            <div style="margin-top:10px">
              <el-button type="primary" plain round @click="resetPwdForFgtPwd">提交新密码</el-button>
            </div>

          </div>
        </div>


      </div>
    </Transition>
  </Teleport>
</template>

<style>
/* 定义CSS变量的默认值 - 全局样式 */
:root {
  --scroll-top: 0px;
}

/* 大厂标准的滚动锁样式（记录滚动位置，防止闪回顶部） */
body.lock-scroll,
html.lock-scroll {
  overflow: hidden !important;
  position: fixed !important;
  width: 100vw !important;
  height: 100vh !important;
  /* 不设置top，由JavaScript动态设置 */
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;

  /* 防止iOS弹性滚动 */
  -webkit-overflow-scrolling: touch;
}

</style>

<style scoped>


/* 模态框容器 */
.auth-container {
  display: flex;
  flex-direction: column;
  /* 相对定位，用于关闭按钮定位 */
  position: relative;
  /* 毛玻璃效果 */
  backdrop-filter: saturate(5) blur(20px);
  background: rgba(255, 255, 255, 0.8);
  /* 圆角边框 */
  border-radius: 15px;
  /* 内部边距 */
  padding: 20px;
  /* 最大宽度，响应式设计 */
  /*max-width: 500px;*/
  max-width: 420px;
  /* 自适应宽度 */
  width: 90%;
  height: 66%;
  /* 缩放动画 */
  animation: scaleIn 0.3s ease;
  /* 确保内部元素可点击 */
  pointer-events: auto;
}

/* 关闭按钮 */
.auth-close {
  /* 绝对定位 */
  position: absolute;
  top: 15px;
  right: 20px;
  /* 样式设置 */
  font-size: 24px;
  font-weight: bold;
  color: #999;
  cursor: pointer;
  /* 过渡效果 */
  transition: color 0.3s ease;
  /* 防止文本选中 */
  user-select: none;
}

.auth-close:hover {
  color: #333;
}

/* 移除原有margin-left: 50% */
.sign-box {
  display: flex;
  flex-direction: column;
  flex: 1; /* 占满父容器剩余高度 */
  min-height: 0; /* 修复Flex溢出问题 */
  position: relative;
  max-width: 400px;
  width: 85%;
  margin: 0 auto;
  padding: 0;
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
}

.sign-box__header {
  min-height: 40px;
  margin-top: 15px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}


.sign-box__body {
  padding: 15px 0;
}


.sign-box__title {
  position: relative;
  font-size: 30px;
  font-weight: 700;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  color: #4e5358;
  /* 伪元素优化 */

  &::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background: var(--accent-pink);
    border-radius: 5px;
    box-shadow: 1px 1px 3px -1px var(--accent-pink);
    transition: width 0.4s ease;
  }

  &:hover::before {
    width: 60px;
  }
}

/*
.sign-box__title::before {
  position: absolute;
  transition: .4s;
  transform-origin: left;
  content: "";
  width: 40px;
  height: 3px;
  background: #f04494;
  left: 0;
  bottom: 0;
  border-radius: 5px;
  box-shadow: 1px 1px 3px -1px #f04494;
}

.sign-box__title:hover::before {
  width: 60px;
} */


.sign-box__button {
  margin: 10px 0;
  color: #777;
  font-size: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-pink);
  }
}

.eye-pos {
  position: relative;
}

.pwd-eye {
  position: absolute;
  right: 10px;
  top: 5px;
}

.sign-box__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.line-form {
  padding-bottom: 3px;
  background: linear-gradient(90deg, rgba(50, 50, 50, .06), rgba(50, 50, 50, .06)) 0 100% / 100% 1px no-repeat;

  &:hover {
    background: linear-gradient(90deg, var(--accent-pink), var(--accent-pink)) 0 100% / 0 1px no-repeat;
    animation: borderExpand 0.8s ease-out forwards;
  }
}


.line-form-input {
  outline: 0;
  border: 0;
  width: 100%;
  padding: 2px;
  opacity: .8;
  background: 0 0;
  line-height: 25px;
  font-size: 15px;
}

.send-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 4px 12px;
  background: rgba(41, 151, 247, .1);
  color: #2997f7;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}


.account-login-btn {
  color: #999;
  cursor: pointer;
  font-size: 13px;
  margin: 10px 2px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  &:hover {
    color: var(--accent-pink);
  }
}

/*
.login-btn {
  color: #fff;
  font-size: 14px;
  width: 80%;
  margin: 30px auto 20px;
  border-radius: 25px;
  padding: 5px;
  text-align: center;
  clear: both;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  cursor: pointer;
  transition: all .3s ease-in-out;
}

.login-btn:hover {
  box-shadow: 0 0 5px #39c5bb;
} */

.login-btn {
  /* 原有样式保持，使用CSS变量 */
  background: var(--primary-gradient);
  color: #fff;
  line-height: 25px;
  font-size: 14px;
  width: 80%;
  margin: 30px auto 20px;
  border-radius: 25px;
  padding: 5px;
  text-align: center;
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 0 5px #39c5bb;
  }

  /* 注册按钮变体 */

  &--register {
    background: var(--secondary-gradient);
  }
}

/*
.social-separator {
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #b1b1b1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
} */

/* 社交登录样式优化 */
.social-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  user-select: none;

  /* 现代分割线样式 */

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--text-muted);
    margin: 0 12px;
  }
}

.social-loginbar {
  display: flex;
  color: #fff;
  font-size: 13px;
  justify-content: center;
}

.social-loginbar-item {
  margin: 0 10px;
  cursor: pointer;
}


.captcha-container {
  margin-bottom: 15px;
  flex-direction: column;
}

.captcha-image {
  border-radius: 15px;
}

.fwd-body {
  position: fixed;
  max-width: 90vw;
  z-index: 2006;
  width: 350px;
  height: 390px;
  /* 核心居中逻辑  inset: 0;
  margin: auto;*/
  left: 0;
  right: 0; /* 仅左右贴边 */
  top: 20px; /* 或任意你需要的垂直位置 */
  margin: 0 auto; /* 仅左右 margin 自动 */
  justify-content: center;
  gap: 17px;
  padding: 30px 25px 25px;
  /* 0.4s	一次动画耗时 0.4 秒（400 ms）。
     cubic-bezier(0.2, 0, 0.2, 1)	速度曲线（缓动函数）。比默认 ease 更“先慢后快再慢”，让放大过程更柔和。
     forwards	填充模式 → 动画结束后保持最后一帧的状态（scale(1) + opacity:1），不会瞬间跳回初始值。*/
  animation: fadeInZoom 0.4s cubic-bezier(0.2, 0, 0.2, 1) forwards;
}

.fwd-close {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #999;
}

/* 输入框容器 */
.fwd-input-box {
  position: relative;
  width: 220px; /* 你想多宽就调 */
}

.fwd-input {
  width: 100%;
  font-size: 14px;
  padding: 4px 28px 4px 6px; /* 右侧留 28px 给图标 */
  box-sizing: border-box;
  border: none;
  line-height: 22px;
  border-radius: 5px;
  outline: none;
}

</style>