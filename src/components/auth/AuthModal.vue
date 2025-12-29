<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref, watch} from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import ResetPwdForm from './ResetPwdForm.vue'
import UnPwdLogin from './UnPwdLogin.vue'

// 定义页面类型
type AuthPage = 'login' | 'register' | 'reset' | 'passwordLess'

// 组件对象映射
const forms = {
  login: LoginForm,
  register: RegisterForm,
  reset: ResetPwdForm,
  passwordLess: UnPwdLogin
}

// 状态管理
const visible = defineModel<boolean>()          // 只接收是否弹出
const page = ref<AuthPage>('login')

/* 登录子组件点击「注册/忘记密码/免密」→ 壳换页 */
const onSwitch = (target: Exclude<AuthPage, 'login'>): void => {
  page.value = target
}

/* 打开弹窗时永远回到登录页 */
watch(visible, (v: boolean) => {
  if (v) {
    page.value = 'login'
  }
}, { immediate: true })

// ESC键处理函数
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    visible.value = false
  }
}

// 组件挂载时初始化
onMounted((): void => {
  document.addEventListener('keydown', handleKeydown)
})

// 组件销毁时清理
onUnmounted((): void => {
  document.removeEventListener('keydown', handleKeydown)
  toggleLock(false)
})

// 滚动锁逻辑
let oldScrollTop = 0;

const toggleLock = (on: boolean): void => {
  if (on) {
    oldScrollTop = window.pageYOffset;
    document.body.style.top = `-${oldScrollTop}px`;
    document.body.classList.add('lock-scroll')
    document.documentElement.classList.add('lock-scroll')
  } else {
    document.body.classList.remove('lock-scroll')
    document.documentElement.classList.remove('lock-scroll')
    window.scrollTo({
      top: oldScrollTop,
      behavior: 'instant' // 瞬间恢复，无动画
    });
  }
}

// 监听可见性变化
watch(() => visible.value, toggleLock, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="backdrop-overlay" @click.self="visible = false">
        <div class="auth-container">
          <!-- 顶部只有「返回登录」+ 叉号 -->
          <div class="header">
            <button v-if="page !== 'login'" @click="page = 'login'" class="back-btn">← 返回登录</button>
            <button class="auth-close" @click="visible = false">×</button>
          </div>
          <div class="sign-box">
            <div class="myCenter sign-box__header">
              <h2>青肆</h2>
            </div>
            
            <!-- 子表单按需渲染 -->
            <KeepAlive>
              <component 
                :is="forms[page]" 
                @success="visible = false"
                @switch="onSwitch"
              />
            </KeepAlive>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 背景遮罩 */
.backdrop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

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
  max-width: 420px;
  /* 自适应宽度 */
  width: 90%;
  height: 66%;
  /* 缩放动画 */
  animation: scaleIn 0.3s ease;
  /* 确保内部元素可点击 */
  pointer-events: auto;
}

/* 顶部头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* 返回按钮 */
.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: var(--accent-pink);
}

/* 关闭按钮 */
.auth-close {
  /* 样式设置 */
  font-size: 24px;
  font-weight: bold;
  color: #999;
  background: none;
  border: none;
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

/* 图形验证码样式 */
.captcha-container {
  margin-bottom: 15px;
  flex-direction: column;
}

.captcha-image {
  border-radius: 15px;
  margin-bottom: 15px;
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
</style>