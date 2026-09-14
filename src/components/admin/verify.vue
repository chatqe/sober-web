<template>
  <div class="verify-page">
    <div class="verify-card">
      <div class="avatar-wrap">
        <el-avatar :size="50" :src="webInfoAvatar" />
      </div>
      <div class="form-item">
        <el-input v-model="account" placeholder="请输入账号">
          <template #prefix><el-icon><User /></el-icon></template>
        </el-input>
      </div>
      <div class="form-item">
        <el-input v-model="password" type="password" placeholder="请输入密码" show-password>
          <template #prefix><el-icon><Lock /></el-icon></template>
        </el-input>
      </div>
      <div class="form-item">
        <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore, useUserStore } from '@/stores'
import { authApi } from '@/api/modules'

interface CommonUtils {
  isEmpty: (value: any) => boolean
  encrypt: (value: string) => string
}
interface AppConstants {
  [key: string]: any
}

const $constant = inject<AppConstants>('$constant')!
const $common = inject<CommonUtils>('$common')!
const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute()

const account = ref<string>('')
const password = ref<string>('')
const redirect = computed(() => route.query.redirect || '/welcome')
const webInfoAvatar = computed(() => userStore.webInfo?.avatar || '')

const login = async () => {
  if ($common.isEmpty(account.value) || $common.isEmpty(password.value)) {
    ElMessage.error('请输入账号或密码！')
    return
  }
  try {
    const user = {
      account: account.value.trim(),
      password: $common.encrypt(password.value.trim()),
      isAdmin: true
    }
    const res: any = await authApi.login(user)
    if (!res) { ElMessage.error('登录失败，无返回数据'); return }
    if (!$common.isEmpty(res.data)) {
      authStore.setAdminToken(res.data.accessToken)
      authStore.setIsAdmin(true)
      userStore.loadCurrentAdmin(res.data)
      account.value = ''
      password.value = ''
      router.push({ path: redirect.value })
    }
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  }
}
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}
.verify-card {
  width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
}
.avatar-wrap {
  margin-bottom: 20px;
}
.form-item {
  margin: 16px 0;
}
.login-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
}
</style>
