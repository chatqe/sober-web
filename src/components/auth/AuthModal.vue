<script setup>
import {computed, defineAsyncComponent, inject, onMounted, onUnmounted, ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import {useAuthStore, useUserStore, useWebInfoStore} from '@/stores'
import {authApi} from '@/api'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import ResetPwdForm from './ResetPwdForm.vue'
import UnPwdLogin from './UnPwdLogin.vue'

// 获取注入的全局属性
const $common = inject('$common')
const $constant = inject('$constant')

// 异步导入组件
const proButton = defineAsyncComponent(() => import("../common/proButton.vue"))

// 组件对象映射（推荐，避免字符串查找）
const forms = {
  login: LoginForm,
  register: RegisterForm,
  reset: ResetPwdForm,
  passwordLess: UnPwdLogin
}

// 状态管理
const visible = defineModel()
const page = ref('login')
const captchaShow = ref(false)
const captchaImg = ref('')
const verifyuuid = ref('')
const captcha = ref('')

// ESC键处理函数
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    handleSuccess()
  }
}

// 组件挂载时初始化
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// 组件销毁时清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  toggleLock(false)
})

// 滚动锁逻辑
let oldScrollTop = 0;

const toggleLock = (on) => {
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
watch(() => visible.value, toggleLock, {immediate: true})

// 处理成功事件
function handleSuccess() {
  // 可扩展：先校验、再提交、再关闭
  visible.value = false
}

// 切换表单页面
const switchForm = (formName) => {
  page.value = formName
}

// 验证码相关
const captchaClose = () => {
  captchaShow.value = false
}

const captchaSubCancel = () => {
  captchaClose()
  captcha.value = ''
}

const captchaSubConfirm = async () => {
  if ($common.isEmpty(captcha.value)) {
    ElMessage.error("请输入图形验证码！")
    return
  }

  const res = await authApi.captchaCheck({uuid: verifyuuid.value, code: captcha.value})
  if (!res.data) {
    ElMessage.error("验证码错误！")
  } else {
    captchaClose()
    captcha.value = ''
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="backdrop-overlay" @click.self="void 0">
        <div class="auth-container">
          <!-- 添加关闭按钮 -->
          <div class="auth-close" @click="handleSuccess">×</div>
          <div class="sign-box">
            <div class="myCenter sign-box__header">
              <h2>青肆</h2>
            </div>

            <!-- 需要保留状态时可包 KeepAlive -->
            <KeepAlive>
              <component
                  :is="forms[page]"
                  @success="handleSuccess"
                  @switchForm="switchForm"
              />
            </KeepAlive>
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