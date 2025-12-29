<script setup lang="ts">
import {inject, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useAuthStore, useUserStore} from '@/stores'
import {authApi} from '@/api'
import {CommonUtils} from '@/types'

// 获取注入的全局属性
const $common = inject<CommonUtils>('$common')!

// 状态管理
const userStore = useUserStore()
const authStore = useAuthStore()

// 登录参数
const account = ref<string>("")
const loginPwd = ref<string>("")
const showPwd = ref<boolean>(false)

// 事件触发
const emit = defineEmits<{
  success: []
  switch: [target: 'register' | 'reset' | 'passwordLess']
}>()

// 登录
const login = async (): Promise<void> => {
  if ($common.isEmpty(account.value) || $common.isEmpty(loginPwd.value)) {
    ElMessage({
      message: "请输入账号或密码！",
      type: "error"
    })
    return
  }

  const user = {
    account: account.value.trim(),
    password: $common.encrypt(loginPwd.value.trim())
  }

  try {
    const res = await authApi.login(user, false, false)
    if (!$common.isEmpty(res.data)) {
      userStore.loadCurrentUser(res.data)
      authStore.setUserToken(res.data.accessToken)
      if (res.data.isAdmin) {
        authStore.setIsAdmin(true)
      }
      account.value = ""
      loginPwd.value = ""
      emit('success')
    }
  } catch (error: any) {
    ElMessage({
      message: error.message,
      type: "error"
    })
  }
}
</script>

<template>
  <div class="sign-box__body">
    <div class="sign-box__title">登录</div>
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
          <!-- 只有登录页才有这 3 个入口 -->
          <div class="account-login-btn" @click="emit('switch', 'reset')">忘记密码</div>
          <div class="account-login-btn" @click="emit('switch', 'passwordLess')">免密登录</div>
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
    
    <!-- 注册入口 -->
    <div style="margin-top: 20px; text-align: center;">
      <span style="color: #777; font-size: 14px;">没有账号？</span>
      <span class="sign-box__button" @click="$emit('switch', 'register')">立即注册 &gt;</span>
    </div>
  </div>
</template>

<style scoped>
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

.sign-box__button {
  color: #777;
  font-size: 14px;
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
  cursor: pointer;
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

@keyframes borderExpand {
  to {
    background-size: 100% 1px;
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

.login-btn {
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
}

.social-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  user-select: none;

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
</style>