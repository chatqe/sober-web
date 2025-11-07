<template>
  <div>
    <div>
      <el-image style="animation: header-effect 2s"
                class="background-image"
                v-once
                lazy
                :src="randomCover"
                fit="cover">
        <template #error>
          <div class="image-slot background-image-error"></div>
        </template>
      </el-image>
      <!-- 输入框 -->
      <div class="message-in" style="text-align: center">
        <h2 class="message-title">树洞</h2>
        <div>
          <input class="message-input"
                 type="text"
                 style="outline: none;width: 70%"
                 placeholder="留下点什么啦~"
                 v-model="messageContent"
                 @click="show = true"
                 maxlength="60"/>
          <button v-show="show"
                  style="margin-left: 12px;cursor: pointer;width: 20%"
                  @click="submitMessage"
                  class="message-input">发射
          </button>
        </div>
      </div>
      <!-- 弹幕 -->
      <div class="danmaku-container">
        <vue-danmaku class="danmaku"
                     ref="danmaku"
                     v-model:danmus="barrageList"
                     :isSuspend="true"
                     :top="20" useSlot loop
                     :speeds="100"
                     :randomChannel="true">
          <template #danmu="{  danmu }">
            <div class="danmu-item" :style="{ color: getRandomColor() }">
              <img class="img" :src="danmu.avatar" alt=""/>
              <span style="margin-right: 5px;">{{ danmu.msg }}</span>
            </div>
          </template>
        </vue-danmaku>
      </div>
    </div>
    <div class="comment-wrap">
      <div class="comment-content">
        <comment :source="source" :type="'message'" :userId="userId"></comment>
      </div>
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
import {computed, defineAsyncComponent, inject, onMounted, ref} from 'vue';
import {useUserStore, useWebInfoStore} from '@/stores';
import {ElMessage} from 'element-plus';
import vueDanmaku from 'vue-danmaku'
import {webInfoApi} from '@/api';

// 获取注入的全局属性
const $common = inject('$common')

// 异步导入组件
const comment = defineAsyncComponent(() => import('@/components/comment/comment.vue'))
const myFooter = defineAsyncComponent(() => import('@/components/common/myFooter.vue'))

// 响应式数据
const show = ref(false);
const messageContent = ref("");
const barrageList = ref([]);
const source = ref(1);
const userId = ref(0);

// 状态管理
const userStore = useUserStore();
const webInfoStore = useWebInfoStore();

const colorList = ref(['rgb(204,255,255)', 'white', 'rgb(204,255,204)', 'white', 'rgb(0,255,255)', 'white', 'rgb(255,204,255)', 'pink'],)

// 生成随机颜色的函数
function getRandomColor() {
  return colorList.value[Math.floor(Math.random() * 8)]
}

// 计算属性
const randomCover = computed(() => {
  const covers = webInfoStore.webInfo?.randomCover || [];
  if (covers.length > 0) {
    return covers[Math.floor(Math.random() * covers.length)];
  }
  return '';
});

// 获取树洞数据
const getTreeHole = async () => {
  try {
    const res = await webInfoApi.listTreeHole();
    if (!$common.isEmpty(res.data)) {
      // res.data.forEach(m => {
      //   barrageList.value.push({
      //     id: m.id,
      //     avatar: m.avatar,
      //     msg: m.message,
      //     time: Math.floor(Math.random() * 5 + 10)
      //   });
      // });
      barrageList.value = res.data.map(m => ({
        id: m.id,
        avatar: m.avatar,
        msg: m.message,
        time: ~~(Math.random() * 5 + 10)   // 位运算取整，比 floor 快一点
      }))
      console.log('barrageList:', barrageList.value)
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    });
  }
};

getTreeHole();

// 提交消息
const submitMessage = async () => {
  if (messageContent.value.trim() === "") {
    ElMessage({
      message: "你还没写呢~",
      type: "warning"
    });
    return;
  }

  let treeHole = {
    message: messageContent.value.trim()
  };

  const currentUser = userStore.currentUser;
  if (!$common.isEmpty(currentUser) && !$common.isEmpty(currentUser.avatar)) {
    treeHole.avatar = currentUser.avatar;
  }

  try {
    const res = await webInfoApi.saveTreeHole(treeHole);
    if (!$common.isEmpty(res.data)) {
      barrageList.value.push({
        id: res.data.id,
        avatar: res.data.avatar,
        msg: res.data.message,
        time: Math.floor(Math.random() * 5 + 10)
      });
    }
  } catch (error) {
    ElMessage({
      message: error.message,
      type: "error"
    });
  }

  messageContent.value = "";
  show.value = false;
};


// 生命周期
// onMounted(() => {
//   // getTreeHole();
// });
</script>

<style scoped>

.message-in {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  color: var(--white);
  animation: hideToShow 2.5s;
  width: 360px;
  z-index: 10;
}

.message-title {
  user-select: none;
  text-align: center;
}

.message-input {
  border-radius: 1.2rem;
  border: var(--white) 1px solid;
  color: var(--white);
  background: var(--transparent);
  padding: 10px 10px;
}

.message-input::-webkit-input-placeholder {
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
  line-height: 1; /* 让字体天然高度生效 */
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
  position: absolute;
  top: 100vh;
  width: 100%;
}

.comment-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
