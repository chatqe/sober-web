<template>
  <div class="myCenter verify-container">
    <div class="verify-content">
      <div>
        <el-avatar :size="50" :src="webInfoAvatar"></el-avatar>
      </div>
      <div>
        <el-input v-model="account">
          <template #prepend>账号</template>
        </el-input>
      </div>
      <div>
        <el-input v-model="password" type="password">
          <template #prepend>密码</template>
        </el-input>
      </div>
      <div>
        <proButton :info="'提交'"
                   @click="login()"
                   :before="beforeColor"
                   :after="afterColor">
        </proButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { useRoute } from 'vue-router'
import router from '@/router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores';
import { authApi } from '@/api/index.js';

// 异步导入组件
const proButton = () => import("../common/proButton.vue");

// 定义接口
interface CommonUtils {
  isEmpty: (value: any) => boolean;
  encrypt: (value: string) => string;
}

interface AppConstants {
  before_color_2: string;
  after_color_2: string;
  [key: string]: any;
}

interface LoginRequest {
  account: string;
  password: string;
  isAdmin: boolean;
}

interface LoginResponse {
  accessToken: string;
  id: number;
  username: string;
  avatar: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  data: T;
  [key: string]: any;
}

// 注入全局属性
const $constant = inject<AppConstants>('$constant')!;
const $common = inject<CommonUtils>('$common')!;
const userStore = useUserStore();
const route = useRoute();

// 响应式数据
const account = ref<string>('');
const password = ref<string>('');
const redirect = computed(() => route.query.redirect || '/welcome');
const webInfoAvatar = computed(() => userStore.webInfo?.avatar || '');
const beforeColor = computed(() => $constant?.before_color_2 || '');
const afterColor = computed(() => $constant?.after_color_2 || '');

// 登录方法
const login = async (): Promise<void> => {
  if ($common.isEmpty(account.value) || $common.isEmpty(password.value)) {
    ElMessage({
      message: "请输入账号或密码！",
      type: "error"
    });
    return;
  }

  try {
    const user: LoginRequest = {
      account: account.value.trim(),
      password: $common.encrypt(password.value.trim()),
      isAdmin: true
    };

    const res: ApiResponse<LoginResponse> = await authApi.login(user)
    
    if (!res.data) {
      ElMessage({
        message: '登录失败，无返回数据',
        type: "error"
      });
      return;
    }
    
    if (!($common.isEmpty(res.data))) {
      localStorage.setItem("adminToken", res.data.accessToken);
      userStore.loadCurrentAdmin(res.data);
      account.value = "";
      password.value = "";
      router.push({path: redirect.value});
    }
  } catch (error) {
    ElMessage({
      message: error.message || '登录失败',
      type: "error"
    });
  }
};
</script>

<style scoped>

  .verify-container {
    height: 100vh;
    background: var(--verifyImage) center center / cover repeat;
  }

  .verify-content {
    background: var(--maxWhiteMask);
    padding: 30px 40px 5px;
    position: relative;
  }

  .verify-content > div:first-child {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -25px;
  }

  .verify-content > div:not(:first-child) {
    margin: 25px 0;
  }

  .verify-content > div:last-child > div {
    margin: 0 auto;
  }

</style>
