<template>
  <div class="moment-card" :class="{ 'my-moment': isMine }">
    <!-- 头部：头像 + 昵称 + 时间 -->
    <div class="moment-header">
      <el-avatar :src="moment.authorAvatar || defaultAvatar" :size="42" class="moment-avatar" />
      <div class="moment-header-right">
        <div class="moment-author">{{ moment.authorName || '匿名' }}</div>
        <div class="moment-time">{{ formatTime(moment.createTime) }}</div>
      </div>
      <el-button
        v-if="isMine"
        type="danger"
        link
        size="small"
        @click="handleDelete"
        class="moment-delete-btn"
      >
        删除
      </el-button>
    </div>

    <!-- 文字内容 -->
    <div v-if="(moment as any).contentSummary" class="moment-content" v-html="renderContent((moment as any).contentSummary)"></div>
    <div v-else-if="(moment as any).content" class="moment-content" v-html="renderContent((moment as any).content)"></div>

    <!-- 图片网格 -->
    <div v-if="imageList.length" class="moment-images" :class="getGridClass(imageList.length)">
      <el-image
        v-for="(img, idx) in imageList"
        :key="idx"
        :src="img.url"
        :preview-src-list="imageList.map(i => i.url)"
        :initial-index="idx"
        fit="cover"
        class="moment-img"
      />
    </div>
    <div v-else-if="moment.hasImages" class="moment-images-placeholder">
      <span class="placeholder-icon">🖼️</span>
      <span>含图片</span>
    </div>

    <!-- 底部操作栏 -->
    <div class="moment-footer">
      <div class="moment-stats">
        <span v-if="moment.likesCount > 0" class="stat-item">
          👍 {{ moment.likesCount }}
        </span>
        <span v-if="moment.commentsCount > 0" class="stat-item" @click="toggleComment">
          💬 {{ moment.commentsCount }}
        </span>
      </div>
      <div class="moment-actions">
        <el-button
          link
          :class="{ 'liked': moment.liked }"
          @click="toggleLike"
        >
          {{ moment.liked ? '已赞' : '赞' }}
        </el-button>
        <el-button link @click="toggleComment">
          评论
        </el-button>
      </div>
    </div>

    <!-- 评论区（展开时显示） -->
    <transition name="slide-down">
      <div v-if="showComment" class="moment-comments">
        <div class="comments-list" ref="commentsListRef">
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <el-avatar :src="c.avatar || defaultAvatar" :size="28" />
            <div class="comment-body">
              <span class="comment-author">{{ c.username || '匿名' }}</span>
              <span class="comment-text">{{ c.content }}</span>
              <span class="comment-time">{{ formatTime(c.createTime) }}</span>
            </div>
          </div>
          <div v-if="!comments.length" class="comment-empty">暂无评论</div>
        </div>
        <div v-if="isLoggedIn" class="comment-input">
          <el-input
            v-model="commentText"
            placeholder="写评论..."
            size="small"
            @keyup.enter="submitComment"
            :maxlength="200"
          >
            <template #append>
              <el-button @click="submitComment" :disabled="!commentText.trim()">发送</el-button>
            </template>
          </el-input>
        </div>
        <div v-else class="comment-login-hint">
          <el-button type="primary" link size="small" @click="$emit('login')">登录后查看评论</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores'
import type { MomentItem } from '@/api/modules/weiYan'
import * as weiYanApi from '@/api/modules/weiYan'

const props = defineProps<{
  moment: MomentItem
}>()

const emit = defineEmits<{
  (e: 'deleted', id: number): void
  (e: 'login'): void
}>()

const $common = inject('$common') as any
const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.currentUser?.id)
const isMine = computed(() => isLoggedIn.value && props.moment.userId === userStore.currentUser.id)

const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 图片列表
const imageList = computed(() =>
  ((props.moment as any).mediaList || [])
    .filter((m: any) => m.mediaType === 1)
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
)

// 评论展开状态
const showComment = ref(false)
const comments = ref<any[]>([])
const commentText = ref('')
const commentsListRef = ref<HTMLElement>()

// 图片网格类名
function getGridClass(count: number) {
  if (count === 1) return 'grid-1'
  if (count === 2) return 'grid-2'
  if (count === 3) return 'grid-3'
  if (count === 4) return 'grid-4'
  return 'grid-default'
}

// 时间格式化
function formatTime(timeStr: string) {
  if (!timeStr) return ''
  const date = new Date(timeStr.replace(/-/g, '/'))
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  if (hours < 48) return '昨天'
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}天前`
  return timeStr.split(' ')[0]
}

// 内容渲染（换行 + 表情）
function renderContent(content: string) {
  let html = content.replace(/\n/g, '<br/>')
  if ($common?.faceReg) html = $common.faceReg(html)
  if ($common?.pictureReg) html = $common.pictureReg(html)
  return html
}

// 点赞切换
async function toggleLike() {
  if (!isLoggedIn.value) {
    emit('login')
    return
  }
  try {
    if (props.moment.liked) {
      await weiYanApi.unlikeMoment(props.moment.id)
    } else {
      await weiYanApi.likeMoment(props.moment.id)
    }
    props.moment.liked = !props.moment.liked
    props.moment.likesCount += props.moment.liked ? 1 : -1
  } catch (e: any) {
    ElMessage.error(e.message || '操作失败')
  }
}

// 切换评论
async function toggleComment() {
  if (!isLoggedIn.value) {
    emit('login')
    return
  }
  showComment.value = !showComment.value
  if (showComment.value && comments.value.length === 0) {
    try {
      comments.value = await weiYanApi.getComments(props.moment.id)
      nextTick(() => scrollToBottom())
    } catch (e: any) {
      ElMessage.error(e.message || '加载评论失败')
    }
  }
}

function scrollToBottom() {
  if (commentsListRef.value) {
    commentsListRef.value.scrollTop = commentsListRef.value.scrollHeight
  }
}

// 提交评论
async function submitComment() {
  const text = commentText.value.trim()
  if (!text) return
  try {
    await weiYanApi.postComment(props.moment.id, text)
    commentText.value = ''
    comments.value = await weiYanApi.getComments(props.moment.id)
    props.moment.commentsCount++
    nextTick(() => scrollToBottom())
  } catch (e: any) {
    ElMessage.error(e.message || '评论失败')
  }
}

// 删除动态
async function handleDelete() {
  try {
    await ElMessageBox.confirm('确认删除这条动态？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    })
    await weiYanApi.deleteMoment(props.moment.id)
    emit('deleted', props.moment.id)
    ElMessage.success('删除成功')
  } catch (e: any) {
    if (e.name !== 'CanceledError') {
      ElMessage.error(e.message || '删除失败')
    }
  }
}
</script>

<style scoped>
.moment-card {
  background: rgba(255, 255, 255, 0.92);
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
  animation: card-in 0.3s ease both;
}

.moment-card:nth-child(1) { animation-delay: 0.05s; }
.moment-card:nth-child(2) { animation-delay: 0.1s; }
.moment-card:nth-child(3) { animation-delay: 0.15s; }
.moment-card:nth-child(4) { animation-delay: 0.2s; }
.moment-card:nth-child(5) { animation-delay: 0.25s; }
.moment-card:nth-child(6) { animation-delay: 0.3s; }
.moment-card:nth-child(7) { animation-delay: 0.35s; }
.moment-card:nth-child(8) { animation-delay: 0.4s; }
.moment-card:nth-child(9) { animation-delay: 0.45s; }
.moment-card:nth-child(10) { animation-delay: 0.5s; }

@keyframes card-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.moment-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* 头部 */
.moment-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.moment-avatar {
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.moment-header-right {
  flex: 1;
  min-width: 0;
}

.moment-author {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  letter-spacing: 0.3px;
}

.moment-time {
  font-size: 12px;
  color: #b0b0b0;
  margin-top: 3px;
  font-weight: 400;
}

.moment-delete-btn {
  flex-shrink: 0;
  font-size: 12px;
  padding: 2px 6px;
  opacity: 0;
  transition: opacity 0.2s;
  margin-top: 4px;
}

.moment-card:hover .moment-delete-btn {
  opacity: 1;
}

/* 内容 */
.moment-content {
  font-size: 15px;
  line-height: 1.75;
  color: #2c2c2c;
  word-break: break-all;
  margin-bottom: 16px;
  letter-spacing: 0.2px;
}

.moment-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
  margin-top: 8px;
  display: block;
}

/* 图片网格 */
.moment-images {
  display: grid;
  gap: 4px;
  margin-bottom: 16px;
}

.grid-1 { grid-template-columns: 1fr; max-width: 280px; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: 1fr 1fr 1fr; }
.grid-4 { grid-template-columns: 1fr 1fr; }

.grid-default {
  grid-template-columns: repeat(3, 1fr);
}

.moment-img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  background: #f5f5f5;
  transition: opacity 0.2s;
}

.moment-img:hover {
  opacity: 0.92;
}

.moment-img :deep(.el-image__inner) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 图片占位符 */
.moment-images-placeholder {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(247, 247, 247, 0.92);
  border-radius: 4px;
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
}

.placeholder-icon {
  font-size: 16px;
}

/* 底部操作栏 */
.moment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.moment-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 13px;
  color: #b0b0b0;
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: default;
}

.moment-actions {
  display: flex;
  gap: 2px;
}

.moment-actions .el-button {
  font-size: 13px;
  color: #b0b0b0;
  padding: 4px 10px;
  transition: color 0.2s, background 0.2s;
  border-radius: 4px;
}

.moment-actions .el-button:hover {
  color: #595959;
  background: rgba(0, 0, 0, 0.04);
}

.moment-actions .el-button.liked {
  color: #ff4d4f;
}

/* 评论区 */
.moment-comments {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
  background: rgba(250, 250, 250, 0.92);
  border-radius: 6px;
  padding: 10px 12px;
}

.comments-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 8px;
}

.comment-item {
  display: flex;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-body {
  flex: 1;
  font-size: 13px;
  line-height: 1.6;
}

.comment-author {
  font-weight: 600;
  color: #595959;
  margin-right: 6px;
}

.comment-text {
  color: #333;
}

.comment-time {
  font-size: 11px;
  color: #bbb;
  margin-left: 6px;
}

.comment-empty {
  text-align: center;
  color: #ccc;
  font-size: 13px;
  padding: 12px 0;
}

.comment-input {
  margin-top: 8px;
}

.comment-login-hint {
  text-align: center;
  padding: 8px 0;
}

/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400px;
}

/* 我的动态微差异化 */
.my-moment {
  background: rgba(250, 250, 250, 0.92);
  border: 1px solid #f0f0f0;
}
</style>
