<script setup>
import {inject, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useAuthStore, useUserStore} from '@/stores'
import {authApi} from '@/api'


// 获取注入的全局属性
const $common = inject('$common')

// 状态管理
const userStore = useUserStore()
const authStore = useAuthStore()

// 登录参数
const account = ref("")
const loginPwd = ref("")
const showPwd = ref(false)

// 显式声明事件（纯 JS 也建议保留注释说明参数）
const emit = defineEmits([
  'switch-form',     // 参数: 'login' | 'register' | 'reset' | 'password-less'
  'update:visible'  // 参数: boolean
])

// 表单页签切换
const handleSwitchForm = (type) => {
  // 可做基础校验：仅允许指定类型
  const allow = ['login', 'register', 'reset', 'pwd-less'].includes(type)
  if (!allow) return
  emit('switch-form', type)
}

// 子表单提交成功后的统一处理
const handleSuccess = () => {
  emit('update:visible', false)
}
// 事件触发

// 切换到注册
const changeLoginCard = () => {
  emit('switchForm', 'register')
}

// 切换到忘记密码
const changeDialog1 = () => {
  emit('switchForm', 'reset')
}

// 切换到免密登录
const changeToUnPwdLogin = () => {
  emit('switchForm', 'passwordLess')
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
  } catch (error) {
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
    <div class="sign-box__button" @click="handleSwitchForm('register')">没有账号？立即注册 &gt;</div>
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
          <Icon