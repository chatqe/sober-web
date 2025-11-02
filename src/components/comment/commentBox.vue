<template>
  <div>
    <!-- 框 -->
    <textarea
      class="comment-textarea"
      v-model="commentContent"
      placeholder="写下点什么..."
      maxlength="1000"/>
    <!-- 按钮 -->
    <div class="myBetween" style="margin-bottom: 10px">
      <div style="display: flex">
        <div :class="{'emoji-active':showEmoji}"
             @click="showEmoji = !showEmoji">
          <el-icon class="myEmoji"><Orange /></el-icon>
        </div>
        <div @click="openPicture()">
          <el-icon class="myPicture"><Picture /></el-icon>
        </div>
      </div>

      <div style="display: flex">
<!--        <proButton :info="'涂鸦'"-->
<!--                   v-show="!$common.mobile() && !disableGraffiti"-->
<!--                   @click.native="showGraffiti()"-->
<!--                   :before="$constant.before_color_1"-->
<!--                   :after="$constant.after_color_1"-->
<!--                   style="margin-right: 6px">-->
<!--        </proButton>-->
        <proButton :info="'提交'"
                   @click="submitComment()"
                   :before="$constant.before_color_2"
                   :after="$constant.after_color_2">
        </proButton>
      </div>
    </div>
    <!-- 表情 -->
    <emoji @addEmoji="addEmoji" :showEmoji="showEmoji"></emoji>

    <el-dialog title="图片"
               v-model="showPicture"
               width="25%"
               :append-to-body="true"
               :close-on-click-modal="false"
               destroy-on-close
               center>
      <div>
        <uploadPicture :prefix="'commentPicture'" @addPicture="addPicture" :maxSize="2"
                       :maxNumber="1"></uploadPicture>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { ElMessage, ElIcon } from 'element-plus'
import { Orange, Picture } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import emoji from '@/components/common/emoji.vue'
import proButton from '@/components/common/proButton.vue'
import uploadPicture from '@/components/common/uploadPicture.vue'

// 注入全局属性
const $common = inject('$common')
const $constant = inject('$constant')

// Props定义
const props = defineProps({
  disableGraffiti: {
    type: Boolean,
    default: false
  }
})

// Emits定义
const emit = defineEmits(['showGraffiti', 'submitComment'])

// 状态管理
const userStore = useUserStore()

// 响应式数据
const commentContent = ref('')
const showEmoji = ref(false)
const showPicture = ref(false)
const picture = reactive({
  name: userStore.currentUser?.username || '',
  url: ''
})

// 方法
function openPicture() {
  if ($common.isEmpty(userStore.currentUser)) {
    ElMessage.error('请先登录！')
    return
  }

  showPicture.value = true
}

function addPicture(res) {
  picture.url = res
  savePicture()
}

function savePicture() {
  const img = `[${picture.name},${picture.url}]`
  commentContent.value += img
  picture.url = ''
  showPicture.value = false
}

function addEmoji(key) {
  commentContent.value += key
}

function showGraffiti() {
  if ($common.isEmpty(userStore.currentUser)) {
    ElMessage.error('请先登录！')
    return
  }

  commentContent.value = ''
  emit('showGraffiti')
}

function submitComment() {
  if ($common.isEmpty(userStore.currentUser)) {
    ElMessage.error('请先登录！')
    return
  }

  if (commentContent.value.trim() === '') {
    ElMessage.warning('你还没写呢~')
    return
  }
  emit('submitComment', commentContent.value.trim())
  commentContent.value = ''
}
</script>

<style scoped>
  .comment-textarea {
    border: 1px solid var(--lightGray);
    width: 100%;
    font-size: 14px;
    padding: 15px;
    min-height: 180px;
    /* 不改变大小 */
    resize: none;
    /* 不改变边框 */
    outline: none;
    border-radius: 4px;
    background-image: var(--commentURL);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 100%;
    margin-bottom: 10px;
  }

  .comment-textarea:focus {
    border-color: var(--themeBackground);
  }

  .myEmoji {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.5s;
    margin-right: 12px;
  }

  .myEmoji:hover {
    transform: rotate(360deg);
    font-size: 22px;
  }

  .myPicture {
    font-size: 18px;
    cursor: pointer;
  }

  .emoji-active {
    color: var(--red);
  }
</style>
