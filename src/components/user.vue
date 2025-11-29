<template>
  <div>
    <!-- 登陆和注册 -->
    <div v-if="$common.isEmpty(currentUser)"
         class="myCenter in-up-container my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                lazy
                :src="webInfoStore.webInfo.randomCover[Math.floor(Math.random() * webInfoStore.webInfo.randomCover.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>

      <div class="sign-container">
        <div class="sign-img">
          <div class="el-image my-el-image" style="border-radius: 15px; overflow: hidden;">
            <img src="https://file.helloljm.com/assets/backgroundPicture.jpg" class="el-image__inner"
                 style="object-fit: cover;" alt="背景图">
          </div>
        </div>

        <div class="sign-box">
          <div class="myCenter" style="height: 30px ;">
            <h2>青肆</h2>
          </div>
          <div>
            <div v-if="isLogin">
              <div class="sign-box-body">
                <div class="sign-box-title">登录</div>
                <div class="sign-box-button" @click="changeLoginCard">没有账号？立即注册 &gt;</div>
              </div>

              <div>
                <div>
                  <div>
                    <div class="line-form">
                      <input v-model="loginParams.account" type="text" placeholder="用户名/邮箱"
                             class="line-form-input">
                    </div>
                    <div class="line-form" style="margin-top: 20px;">
                      <input v-model="loginParams.password" autocomplete="current-password" type="password"
                             placeholder="登录密码"
                             class="line-form-input">
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                      <div class="account-login-btn">修改密码</div>
                      <div class="account-login-btn"> 免密登录</div>
                    </div>
                  </div>

                  <div class="login-btn" @click="login()"
                       style="background: linear-gradient(135deg, rgb(89, 195, 251) 10%, rgb(38, 141, 247) 100%);">
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
              <div class="sign-box-body">
                <div class="sign-box-title">注册</div>
                <div class="sign-box-button" @click="changeLoginCard">已有账号？立即登录 &gt;</div>
              </div>
              <div>
                <div>
                  <div class="line-form">
                    <input v-model="registParams.username" type="text" maxlength="30" placeholder="用户名"
                           class="line-form-input">
                  </div>
                  <div class="line-form" style="margin-top: 20px;">
                    <input v-model="registParams.password"
                           type="password"
                           autocomplete="new-password"
                           maxlength="30"
                           placeholder="登录密码"
                           class="line-form-input">
                  </div>
                  <div class="line-form" style="margin-top: 20px;">
                    <input v-model="email"
                           type="text"
                           placeholder="邮箱"
                           class="line-form-input">
                  </div>
                  <div class="line-form" style="margin-top: 20px; position: relative;">
                    <input v-model="registParams.code" autocomplete="off" type="number" placeholder="验证码"
                           class="line-form-input">
                    <button class="send-btn" @click="getCode">验证码</button>
                  </div>
                </div>
                <div class="login-btn" @click="regist()"
                     style="background: linear-gradient(135deg, rgb(96, 228, 100) 10%, rgb(92, 184, 91) 100%);">
                  <i aria-hidden="true"></i> 注册
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>


      <!--图形验证码弹层-->
      <el-dialog v-model="captchaShow"
                 width="25%"
                 title="图形验证码"
                 center
                 align-center
                 :before-close="captchaClose">

        <div class="captcha-container myCenter">
          <div style="margin: 20px auto;">
            <div>
              <el-image class="my-el-image captcha-image"
                        lazy
                        :src="captchaImg"
                        fit="cover"/>
            </div>
            <div>
              <el-input v-model="captcha.value" size="large" autocomplete="off"/>
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

    </div>


    <!-- 用户信息 -->
    <div v-else class="user-container myCenter my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image"
                style="position: absolute"
                v-once
                lazy
                :src="webInfoStore.webInfo.randomCover[Math.floor(Math.random() * webInfoStore.webInfo.randomCover.length)]"
                fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="shadow-box-mini user-info" style="display: flex">
        <div class="user-left">
          <div>
            <el-avatar class="user-avatar" @click="changeDialog('修改头像')" :size="60"
                       :src="currentUser.avatar"></el-avatar>
          </div>
          <div class="myCenter" style="margin-top: 12px">
            <div class="user-title">
              <div>用户名：</div>
              <div>手机号：</div>
              <div>邮箱：</div>
              <div>性别：</div>
              <div>简介：</div>
            </div>
            <div class="user-content">
              <div>
                <el-input maxlength="30" v-model="currentUser.username"></el-input>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentUser.phoneNumber)">
                  {{ currentUser.phoneNumber }} <span class="changeInfo"
                                                      @click="changeDialog('修改手机号')">修改（功能未接入）</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定手机号')">绑定手机号（功能未接入）</span>
                </div>
              </div>
              <div>
                <div v-if="!$common.isEmpty(currentUser.email)">
                  {{ currentUser.email }} <span class="changeInfo" @click="changeDialog('修改邮箱')">修改</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定邮箱')">绑定邮箱</span></div>
              </div>
              <div>
                <el-radio-group v-model="currentUser.gender">
                  <el-radio :label="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                  <el-radio :label="1" style="margin-right: 10px">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-input v-model="currentUser.introduction"
                          maxlength="60"
                          type="textarea"
                          show-word-limit></el-input>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px">
            <proButton :info="'提交'"
                       @click="submitUserInfo()"
                       :before="$constant.before_color_2"
                       :after="$constant.after_color_2">
            </proButton>
          </div>
        </div>
        <div class="user-right">

        </div>
      </div>
    </div>


    <el-dialog :title="dialogTitle"
               v-model="showDialog"
               width="30%"
               :before-close="clearDialog"
               :append-to-body="true"
               :close-on-click-modal="false"
               center>
      <div class="myCenter" style="flex-direction: column">
        <div>
          <div v-if="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号'">
            <div style="margin-bottom: 5px">手机号：</div>
            <el-input v-model="phoneNumber"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱'">
            <div style="margin-bottom: 5px">邮箱：</div>
            <el-input v-model="email"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改头像'">
            <uploadPicture :prefix="'userAvatar'" @addPicture="addPicture" :maxSize="1"
                           :maxNumber="1"></uploadPicture>
          </div>
          <div v-else-if="dialogTitle === '找回密码'">
            <div class="myCenter" style="margin-bottom: 12px">
              <el-radio-group v-model="passwordFlag">
                <el-radio :label="1" style="margin-right: 10px">手机号</el-radio>
                <el-radio :label="2">邮箱</el-radio>
              </el-radio-group>
            </div>
            <div v-if="passwordFlag === 1">
              <div style="margin-bottom: 5px">手机号：</div>
              <el-input v-model="phoneNumber"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input maxlength="30" v-model="password"></el-input>
            </div>
            <div v-else-if="passwordFlag === 2">
              <div style="margin-bottom: 5px">邮箱：</div>
              <el-input v-model="email"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input maxlength="30" v-model="password"></el-input>
            </div>
          </div>
          <div v-else-if="dialogTitle === '邮箱验证码'">
            <div>
              <div style="margin-bottom: 5px">邮箱：</div>
              <el-input v-model="email"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
            </div>
          </div>
        </div>
        <div style="display: flex;margin-top: 30px" v-show="dialogTitle !== '修改头像'">
          <proButton :info="codeString"
                     v-show="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号' || dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱' || dialogTitle === '找回密码' || dialogTitle === '邮箱验证码'"
                     @click="getCode()"
                     :before="$constant.before_color_1"
                     :after="$constant.after_color_1"
                     style="margin-right: 20px">
          </proButton>
          <proButton :info="'提交'"
                     @click="submitDialog()"
                     :before="$constant.before_color_2"
                     :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, computed, onUnmounted, inject} from 'vue'
import router from '@/router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useAuthStore, useUserStore, useWebInfoStore} from '@/stores'
import {authApi, userApi} from '@/api'
import {defineAsyncComponent} from 'vue'
import {getCaptchaCode} from "@/api/modules/auth.js";

// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

// 异步导入组件
const proButton = defineAsyncComponent(() => import("./common/proButton.vue"))
const uploadPicture = defineAsyncComponent(() => import("./common/uploadPicture.vue"))

// 状态管理
// ... existing code ...
const userStore = useUserStore()
const webInfoStore = useWebInfoStore()
const authStore = useAuthStore()

// 登录参数
const loginParams = ref({
  account: "",
  password: ""
})
// 注册参数
const registParams = ref({
  username: "",
  password: "",
  code: ''
})
const phoneNumber = ref("")
const email = ref("")
const avatar = ref("")
const showDialog = ref(false)
const showRegist = ref(false)
const dialogTitle = ref("")
const codeString = ref("验证码")
const passwordFlag = ref(null)
const isLogin = ref(true)
let intervalCode = null
const captchaShow = ref(false)
const captchaImg = ref('')
const verifyuuid = ref('')
const captcha = ref('')

// 计算属性
const currentUser = computed(() => userStore.currentUser)
const webInfo = computed(() => webInfoStore.webInfo)

// 清理定时器
onUnmounted(() => {
  if (intervalCode) {
    clearInterval(intervalCode)
  }
})

// 上传头像回调
const addPicture = (res) => {
  avatar.value = res
  submitDialog()
}

const captchaClose = () => {
  console.log("关闭验证码对话框")
  captchaShow.value = false
}
const captchaSubCancel = () => {
  captchaClose()
}
const captchaSubConfirm = () => {
  captchaClose()
}

// 新切换登录/注册面板
const changeLoginCard = () => {
  isLogin.value = !isLogin.value
}

// 切换登录/注册面板
const signUp = () => {
  showRegist.value = true
}

const signIn = () => {
  showRegist.value = false
}

// 登录
const login = async () => {
  if ($common.isEmpty(loginParams.value.account) || $common.isEmpty(loginParams.value.password)) {
    ElMessage({
      message: "请输入账号或密码！",
      type: "error"
    })
    return
  }

  let user = {
    account: loginParams.value.account.trim(),
    password: $common.encrypt(loginParams.value.password.trim())
  }

  try {
    const res = await authApi.login(user, false, false)
    if (!$common.isEmpty(res.data)) {
      userStore.loadCurrentUser(res.data)
      authStore.setUserToken(res.data.accessToken)
      if (res.data.isAdmin) {
        authStore.setIsAdmin(true)
      }
      loginParams.value.account = ""
      loginParams.value.password = ""
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
const regist = async () => {
  if ($common.isEmpty(registParams.value.username) || $common.isEmpty(registParams.value.password)) {
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

  if ($common.isEmpty(registParams.value.code)) {
    ElMessage({
      message: "请输入验证码！",
      type: "error"
    })
    return
  }

  if (registParams.value.username.indexOf(" ") !== -1 || registParams.value.password.indexOf(" ") !== -1) {
    ElMessage({
      message: "用户名或密码不能包含空格！",
      type: "error"
    })
    return
  }

  let user = {
    username: registParams.value.username.trim(),
    code: registParams.value.code.trim(),
    password: $common.encrypt(registParams.value.password.trim())
  }

  if (dialogTitle.value === "邮箱验证码") {
    user.email = email.value
  }

  try {
    const res = await userApi.regist(user)
    if (!$common.isEmpty(res.data)) {
      userStore.loadCurrentUser(res.data)
      localStorage.setItem("userToken", res.data.accessToken)
      registParams.value.username = ""
      registParams.value.password = ""
      registParams.value.code = ""
      email.value = ""
      router.push({path: '/'})
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 提交用户信息
const submitUserInfo = async () => {
  if (!checkParameters()) {
    return
  }

  let user = {
    username: currentUser.value.username,
    gender: currentUser.value.gender
  }

  if (!$common.isEmpty(currentUser.value.introduction)) {
    user.introduction = currentUser.value.introduction.trim()
  }

  try {
    await ElMessageBox.confirm('确认保存？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    })

    const res = await userApi.updateUserInfo(user)
    if (!$common.isEmpty(res.data)) {
      userStore.loadCurrentUser(res.data)
      ElMessage({
        message: "修改成功！",
        type: "success"
      })
    }
  } catch (error) {
    // 如果是取消操作，不显示错误消息
    if (error !== 'cancel') {
      ElMessage({
        message: error.message || '已取消保存!',
        type: error !== 'cancel' ? "error" : "success"
      })
    }
  }
}

// 检查参数
const checkParams = (params) => {
  if (dialogTitle.value === "修改手机号" || dialogTitle.value === "绑定手机号" || (dialogTitle.value === "找回密码" && passwordFlag.value === 1)) {
    params.flag = 1
    if ($common.isEmpty(phoneNumber.value)) {
      ElMessage({
        message: "请输入手机号！",
        type: "error"
      })
      return false
    }
    if (!(/^1[345789]\d{9}$/.test(phoneNumber.value))) {
      ElMessage({
        message: "手机号格式有误！",
        type: "error"
      })
      return false
    }
    params.place = phoneNumber.value
    return true
  } else if (dialogTitle.value === "修改邮箱" || dialogTitle.value === "绑定邮箱" || dialogTitle.value === "邮箱验证码" || (dialogTitle.value === "找回密码" && passwordFlag.value === 2)) {
    params.flag = 2
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
    params.place = email.value
    return true
  }
  return false
}

const checkParameters = () => {
  if ($common.isEmpty(currentUser.value.username)) {
    ElMessage({
      message: "请输入用户名！",
      type: "error"
    })
    return false
  }

  if (currentUser.value.username.indexOf(" ") !== -1) {
    ElMessage({
      message: "用户名不能包含空格！",
      type: "error"
    })
    return false
  }
  return true
}

// 切换对话框
const changeDialog = (value) => {
  if (value === "邮箱验证码") {
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
  }

  dialogTitle.value = value
  showDialog.value = true
}

// 提交对话框内容
const submitDialog = async () => {
  if (dialogTitle.value === "修改头像") {
    if ($common.isEmpty(avatar.value)) {
      ElMessage({
        message: "请上传头像！",
        type: "error"
      })
    } else {
      let user = {
        avatar: avatar.value.trim()
      }

      try {
        const res = await userApi.updateUserInfo(user)
        if (!$common.isEmpty(res.data)) {
          userStore.loadCurrentUser(res.data)
          clearDialog()
          ElMessage({
            message: "修改成功！",
            type: "success"
          })
        }
      } catch (error) {
        ElMessage({
          message: error.message,
          type: "error"
        })
      }
    }
  } else if (dialogTitle.value === "修改手机号" || dialogTitle.value === "绑定手机号" || dialogTitle.value === "修改邮箱" || dialogTitle.value === "绑定邮箱") {
    updateSecretInfo()
  } else if (dialogTitle.value === "找回密码") {
    if (passwordFlag.value !== 1 && passwordFlag.value !== 2) {
      ElMessage({
        message: "请选择找回方式！",
        type: "error"
      })
    } else {
      updateSecretInfo()
    }
  } else if (dialogTitle.value === "邮箱验证码") {
    showDialog.value = false
  }
}

// 更新密码等敏感信息
const updateSecretInfo = async () => {
  if ($common.isEmpty(code.value)) {
    ElMessage({
      message: "请输入验证码！",
      type: "error"
    })
    return
  }
  if ($common.isEmpty(password.value)) {
    ElMessage({
      message: "请输入密码！",
      type: "error"
    })
    return
  }
  let params = {
    code: code.value.trim(),
    password: $common.encrypt(password.value.trim())
  }
  if (!checkParams(params)) {
    return
  }

  try {
    if (dialogTitle.value === "找回密码") {
      await userApi.updateForForgetPassword(params, false, false)
      clearDialog()
      ElMessage({
        message: "修改成功，请重新登陆！",
        type: "success"
      })
    } else {
      const res = await userApi.updateSecretInfo(params, false, false)
      if (!$common.isEmpty(res.data)) {
        userStore.loadCurrentUser(res.data)
        clearDialog()
        ElMessage({
          message: "修改成功！",
          type: "success"
        })
      }
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}

// 清理对话框
const clearDialog = () => {
  showDialog.value = false
  phoneNumber.value = ""
  email.value = ""
  password.value = ""
  code.value = ""
  codeString.value = "验证码"
  if (intervalCode) {
    clearInterval(intervalCode)
  }
}

// 获取验证码
const getCode = async () => {
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
  captchaShow.value = true

  const res = await authApi.getCaptchaCode({flag: true, email: email.value})
  captchaImg.value = res.data.img
  verifyuuid.value = res.data.uuid
  // console.log(res)

}
const getCode1 = async () => {
  if (codeString.value === "验证码") {
    // 获取验证码
    let params = {}
    if (!checkParams(params)) {
      return
    }

    let url
    if (dialogTitle.value === "找回密码") {
      url = "/user/getCodeForForgetPassword"
    } else if (dialogTitle.value === "邮箱验证码") {
      url = "/user/getCodeByRegister"
    } else {
      url = "/user/getCodeForBind"
    }

    try {
      await userApi.getCode(url, params)
      ElMessage({
        message: "验证码已发送，请注意查收！",
        type: "success"
      })

      codeString.value = "30"
      intervalCode = setInterval(() => {
        if (codeString.value === "0") {
          clearInterval(intervalCode)
          codeString.value = "验证码"
        } else {
          codeString.value = (parseInt(codeString.value) - 1) + ""
        }
      }, 1000)
    } catch (error) {
      ElMessage({
        message: error.message,
        type: "error"
      })
    }
  } else {
    ElMessage({
      message: "请稍后再试！",
      type: "warning"
    })
  }
}

</script>

<style scoped>

.in-up-container {
  height: 100vh;
  position: relative;
}

.in-up {
  opacity: 0.9;
  border-radius: 10px;
  box-shadow: 0 15px 30px var(--miniMask), 0 10px 10px var(--miniMask);
  position: relative;
  overflow: hidden;
  width: 750px;
  max-width: 100%;
  min-height: 450px;
  margin: 10px;
}

.in-up p {
  font-size: 14px;
  letter-spacing: 1px;
  margin: 20px 0 30px 0;
}

.in-up a {
  color: var(--black);
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.form-container {
  position: absolute;
  height: 100%;
  transition: all 0.5s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
}

.form-container div {
  background: var(--white);
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
}

.form-container input {
  background: var(--maxLightGray);
  border-radius: 2px;
  border: none;
  padding: 12px 15px;
  margin: 10px 0;
  width: 100%;
  outline: none;
}

.in-up button {
  border-radius: 2rem;
  border: none;
  background: var(--lightRed);
  color: var(--white);
  font-size: 16px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 2px;
  cursor: pointer;
}

.in-up button:hover {
  animation: scale 0.8s ease-in-out;
}

.in-up button.ghost {
  background: transparent;
  border: 1px solid var(--white);
}

.sign-up-container button {
  margin-top: 20px;
}

.overlay-container {
  position: absolute;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

.overlay {
  background: var(--gradualRed);
  color: var(--white);
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
}

.overlay-panel {
  position: absolute;
  top: 0;
  flex-direction: column;
  height: 100%;
  width: 50%;
  transition: all 0.5s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateY(0);
}

.overlay-left {
  transform: translateY(-20%);
}

.in-up.right-panel-active .sign-in-container {
  transform: translateY(100%);
}

.in-up.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.in-up.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
}

.in-up.right-panel-active .overlay {
  transform: translateX(50%);
}

.in-up.right-panel-active .overlay-left {
  transform: translateY(0);
}

.in-up.right-panel-active .overlay-right {
  transform: translateY(20%);
}

.user-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.user-info {
  width: 80%;
  z-index: 10;
  margin-top: 70px;
  height: calc(100vh - 90px);
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.user-left {
  width: 50%;
  background: var(--maxMaxWhiteMask);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 20px;
}

.user-right {
  width: 50%;
  background: var(--maxWhiteMask);
  padding: 20px;
}

.user-title {
  text-align: right;
  user-select: none;
}

.user-content {
  text-align: left;
}

.user-title div {
  height: 55px;
  line-height: 55px;
  text-align: center;
}

.user-content > div {
  height: 55px;
  display: flex;
  align-items: center;
}

.user-content >>> .el-input__inner, .user-content >>> .el-textarea__inner {
  border: none;
  background: var(--whiteMask);
}

.user-content >>> .el-input__count {
  background: var(--transparent);
  user-select: none;
}

.changeInfo {
  color: var(--white);
  font-size: 0.75rem;
  cursor: pointer;
  background: var(--themeBackground);
  padding: 3px;
  border-radius: 0.2rem;
  user-select: none;
}

@media screen and (max-width: 920px) {
  .user-info {
    width: 90%;
  }

  .user-left {
    width: 100%;
  }

  .user-right {
    display: none;
  }
}


.sign-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 20px;
  animation: baseShow 0.5s cubic-bezier(0.32, 0.85, 0.45, 1.18);
  z-index: 10;
}

.sign-img {
  position: absolute;
  padding-right: 35%;
  top: -40px;
  left: 0;
  right: 0;
  bottom: -40px;
}

.sign-box {
  position: relative;
  margin-left: 50%;
  max-width: 400px;
  backdrop-filter: saturate(5) blur(20px);
  background: rgba(255, 255, 255, 0.8);
  padding: 30px 30px 15px;
  border-radius: 15px;
}

.sign-box-body {
  padding: 15px 0;
}


.sign-box-title {
  position: relative;
  font-size: 30px;
  font-weight: 700;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  color: #4e5358;
}

.sign-box-title::before {
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

.sign-box-title:hover::before {
  width: 60px;
}


.sign-box-button {
  margin: 10px 0;
  color: #777;
  font-size: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  transition: all .3s;
}

.sign-box-button:hover {
  color: #f04494;
}

.line-form {
  padding-bottom: 3px;
  background: linear-gradient(90deg, rgba(50, 50, 50, .06), rgba(50, 50, 50, .06)) 0 100% / 100% 1px no-repeat;
}


.line-form:hover {
  background: linear-gradient(90deg, #f04494, #f04494) 0 100% / 0 1px no-repeat;
  animation: borderExpand .8s ease-out forwards;
}

.line-form-input {
  outline: 0;
  border: 0;
  width: 100%;
  padding: 2px;
  opacity: .8;
  background: 0 0;
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
}

.account-login-btn:hover {
  color: #f04494;
}

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
}

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
</style>
