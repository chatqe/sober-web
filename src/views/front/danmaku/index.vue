<template>
  <div>
    <div>
      <el-image style="animation: header-effect 2s"
                class="background-image"
                v-once
                lazy
                fit="cover">
        <template #error>
          <div class="image-slot background-image-error"></div>
        </template>
      </el-image>
      <!-- 输入框 -->
      <div class="danmaku-in" style="text-align: center">
        <h2 class="danmaku-title">弹幕</h2>
        <div>
          <input class="danmaku-input"
                 type="text"
                 style="outline: none;width: 70%"
                 placeholder="留下点什么啦~"
                 v-model="messageContent"
                 @click="show = true"
                 maxlength="60"/>
          <button v-show="show"
                  style="margin-left: 12px;cursor: pointer;width: 20%"
                  @click="submitMessage"
                  class="danmaku-input">发射
          </button>
        </div>
      </div>
      <!-- 弹幕 -->
      <div class="danmaku-container">
        <vue-danmaku class="danmaku"
                     ref="danmaku"
                     v-model:danmus="barrageList"
                     :isSuspend="true"
                     :top="6" useSlot loop
                     :speeds="110"
                     :randomChannel="true">
          <template #danmu="{ danmu }">
            <div class="danmu-item" :style="{ color: getRandomColor() }">
              <img class="img" :src="danmu.avatar" alt=""/>
              <span style="margin-right: 5px;">{{ danmu.msg }}</span>
            </div>
          </template>
        </vue-danmaku>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';
import vueDanmaku from 'vue-danmaku'
import { danmakuApi } from '@/api/modules';
import type { CommonUtils } from '@/types'

const $common = inject<CommonUtils>('$common')!

// comment component not used in danmaku page
const myFooter = defineAsyncComponent(() => import('@/components/business/MyFooter.vue'))

const show = ref(false);
const messageContent = ref("");
const barrageList = ref([]);
const source = ref(0); // bizId: 树洞留言的固定bizId为0（留言板专用）
const userId = ref<number>(0);

const userStore = useUserStore();

const colorList = ref(['rgb(204,255,255)', 'white', 'rgb(204,255,204)', 'white', 'rgb(0,255,255)', 'white', 'rgb(255,204,255)', 'pink'])

function getRandomColor() {
  return colorList.value[Math.floor(Math.random() * colorList.value.length)]
}

const danmakuList = async () => {
  try {
    const res = await danmakuApi.list();
    if (!$common.isEmpty(res)) {
      barrageList.value = res.map((m: any) => ({
        id: String(m.createTime || Math.random()),
        avatar: m.avatar,
        msg: m.message,
        time: ~~(Math.random() * 5 + 10)
      }))
    }
  } catch (error: any) {
    ElMessage({
      message: error.message || '获取弹幕失败',
      type: "error"
    });
  }
};

danmakuList();

const submitMessage = async () => {
  if (messageContent.value.trim() === "") {
    ElMessage({
      message: "你还没写呢~",
      type: "warning"
    });
    return;
  }

  let danmakuMsg: any = {
    message: messageContent.value.trim()
  };

  const currentUser = userStore.currentUser as any;
  if (!$common.isEmpty(currentUser) && !$common.isEmpty(currentUser.avatar)) {
    danmakuMsg.avatar = currentUser.avatar;
  }

  try {
    const res = await danmakuApi.save(danmakuMsg);
    if (!$common.isEmpty(res)) {
      barrageList.value.push({
        id: res.id,
        avatar: res.avatar,
        msg: res.message,
        time: Math.floor(Math.random() * 5 + 10)
      });
      ElMessage({
        message: "发送成功！",
        type: "success"
      });
    }
  } catch (error: any) {
    ElMessage({
      message: error.message || '发送失败',
      type: "error"
    });
  }

  messageContent.value = "";
  show.value = false;
};

onMounted(() => {
  const currentUser = userStore.currentUser as any;
  if (!$common.isEmpty(currentUser)) {
    userId.value = currentUser.id || 0;
  }
});
</script>

<style scoped>

.danmaku-in {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  color: var(--white);
  animation: hideToShow 2.5s;
  width: 360px;
  z-index: 10;
}

.danmaku-title {
  user-select: none;
  text-align: center;
}

.danmaku-input {
  border-radius: 1.2rem;
  border: var(--white) 1px solid;
  color: var(--white);
  background: var(--transparent);
  padding: 10px 10px;
}

.danmaku-input::-webkit-input-placeholder {
  color: var(--white);
}

.danmaku-container {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100% - 50px);
  width: 100%;
  user-select: none;
  overflow: hidden;
}

.danmaku {
  width: 100%;
  height: 100%;
}

.danmu-item {
  display: inline-flex;
  padding: 5px 6px;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 50px;
  font-size: 16px;
  line-height: 1;
  align-items: center;
  z-index: 10;
}

.danmu-item .img {
  width: 30px;
  height: 30px;
  border-radius: 50px;
  margin-right: 9px;
}

.comment-wrap {
  background: var(--background);
  top: 100vh;
  width: 100%;
}

.comment-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
