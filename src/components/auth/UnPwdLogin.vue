<script setup lang="ts">
import {inject, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useAuthStore, useUserStore} from '@/stores'
import {authApi} from '@/api'

// 获取注入的全局属性
import type { CommonUtils } from '@/types'
const $common = inject<CommonUtils>('$common')!

// 状态管理
const userStore = useUserStore()
const authStore = useAuthStore()

// 免密登录参数
const email = ref<string>("")
const code = ref<string>("")

// 事件触发
const emit = defineEmits<{
  success: []
  switch: [target: 'login']
}>()

// 验证邮箱
const verifyEmail = (): boolean => {
  if ($common.isEmpty(email.value)) {
    ElMessage.error("请输入邮箱！")
    return false
  }
  if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(email.value))) {
    ElMessage.error("邮箱格式有误！")
    return false
  }
  return true
}

// 获取验证码
const getCode = async (): Promise<void> => {
  if (!verifyEmail()) return
  try {
    const res = await authApi.getCaptchaCode({flag: true, email: email.value})
    ElMessage.success("验证码已发送，请注意查收！")
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

// 免密登录
const login = async (): Promise<void> => {
  if (!$common.isEmpty(email.value) && !$common.isEmpty(code.value)) {
    try {
      const res = await authApi.passwordLessLogin({email: email.value, code: code.value})
      if (!res.data) return
      
      userStore.loadCurrentUser(res.data)
      authStore.setUserToken(res.data.accessToken)
      if (res.data.isAdmin) {
        authStore.setIsAdmin(true)
      }
      email.value = ""
      code.value = ""
      emit('success')
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  } else {
    ElMessage.error("请输入完整信息！")
  }
}
</script>

<template>
  <div class="sign-box__body">
    <div class="sign-box__title">免密登录</div>
  </div>
  <div>
    <div>
      <div class="line-form">
        <input v-model="email" type="text" placeholder="邮箱" 
               class="line-form-input">
      </div>
      <div class="line-form" style="margin-top: 20px; position: relative;">
        <input v-model="code" autocomplete="off" type="text" placeholder="验证码" 
               class="line-form-input">
        <button class="send-btn" @click="getCode">验证码</button>
      </div>
    </div>
    <div class="login-btn" @click="login" 
         style="background: linear-gradient(135deg, rgb(96, 228, 100) 10%, rgb(92, 184, 91) 100%);">
      <i aria-hidden="true"></i> 登录
    </div>
    
    <!-- 登录入口 -->
    <div style="margin-top: 20px; text-align: center;">
      <span style="color: #777; font-size: 14px;">已有密码？</span>
      <span class="sign-box__button" @click="emit('switch', 'login')">密码登录 &gt;</span>
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
</style>