<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div class="my-animation-slide-bottom message-container">
      <!-- 留言列表区域 -->
      <div class="message-wrap shadow-box">
        <!-- 空状态 -->
        <div v-if="comments.length === 0" class="message-empty">
          <span>还没有留言，来做第一个留言的人吧~</span>
        </div>

        <!-- 留言卡片列表 -->
        <div v-for="(item, index) in comments" :key="index" class="message-card">
          <!-- 卡片头部 -->
          <div class="message-card-header">
            <el-avatar :size="40" :src="item.avatar" class="message-avatar" />
            <div class="message-card-info">
              <span class="message-username">{{ item.nickname }}</span>
              <span class="message-time">{{ $common.getDateDiff(item.createTime) }}</span>
            </div>
            <div class="message-card-meta">
              <span v-if="item.isTop === 1" class="message-top-tag">置顶</span>
              <span class="message-reply-count" @click="toggleReplies(item)">
                💬 {{ item.replyCount || 0 }}
              </span>
            </div>
          </div>

          <!-- 留言内容 -->
          <div class="message-card-content" v-html="item.content"></div>

          <!-- 回复列表 -->
          <div v-if="item.showReplies && replyMap[item.id]" class="message-replies">
            <div v-for="reply in replyMap[item.id]" :key="reply.id" class="message-reply">
              <el-avatar :size="32" :src="reply.avatar" class="message-reply-avatar" />
              <div class="message-reply-content">
                <div class="message-reply-header">
                  <span class="message-reply-username">{{ reply.nickname }}</span>
                  <span v-if="reply.isAdmin === 1" class="message-admin-tag">管理员</span>
                  <span class="message-reply-time">{{ $common.getDateDiff(reply.createTime) }}</span>
                </div>
                <div v-if="reply.replyToName" class="message-reply-to-user">
                  回复 <span class="highlight">@{{ reply.replyToName }}</span>：
                </div>
                <div class="message-reply-text" v-html="reply.content"></div>
              </div>
            </div>
            <!-- 展开更多回复 -->
            <div
              v-if="replyMap[item.id].length < (replyTotalMap[item.id] || 0)"
              class="message-expand"
              @click="loadMoreReplies(item)"
            >
              展开 {{ (replyTotalMap[item.id] || 0) - replyMap[item.id].length }} 条回复
            </div>
            <div v-if="replyMap[item.id].length > 0" class="message-reply-divider" />
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrap">
          <proPage
            v-if="pagination.total > pagination.size"
            :current="pagination.current"
            :size="pagination.size"
            :total="pagination.total"
            :buttonSize="6"
            :color="$constant.commentPageColor"
            @toPage="toPage"
          />
          <div v-else style="user-select: none; text-align: center; color: var(--greyFont); padding: 20px 0;">
            ~~暂无留言~~
          </div>
        </div>
      </div>

      <!-- 留言输入区域 -->
      <div class="message-input-wrap shadow-box">
        <div class="message-input-header">
          <span class="message-input-title">💬 说点什么吧</span>
          <span class="message-total">{{ pagination.total }} 条留言</span>
        </div>
        <textarea
          v-model="commentContent"
          class="message-textarea"
          placeholder="写下你的留言..."
          maxlength="1000"
        ></textarea>
        <div class="message-input-footer">
          <div class="message-input-tools">
            <span class="message-emoji-btn" @click="showEmoji = !showEmoji">😊</span>
          </div>
          <button class="message-submit-btn" @click="submitComment">发布留言</button>
        </div>
        <!-- 表情选择 -->
        <div v-if="showEmoji" class="message-emoji-panel">
          <Emoji @addEmoji="addEmoji" :showEmoji="showEmoji" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject, defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { messageApi } from '@/api/modules'
import type { CommonUtils, AppConstants } from '@/types'
import type { MessageReplyVO } from '@/types/modules/messageReplyVO'
import proPage from '@/components/base/ProPage.vue'

const $common = inject<CommonUtils>('$common')!
const $constant = inject<AppConstants>('$constant')!

const twoPoem = defineAsyncComponent(() => import('@/components/business/twoPoem/TwoPoem.vue'))
const Emoji = defineAsyncComponent(() => import('@/components/business/comment/Emoji.vue'))

// 状态
const comments = ref<any[]>([])
const commentContent = ref('')
const showEmoji = ref(false)

// 回复状态
const replyMap = ref<Record<number, MessageReplyVO[]>>({})
const replyTotalMap = ref<Record<number, number>>({})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
})

// 加载留言列表
const loadComments = async () => {
  try {
    const res = await messageApi.list({
      pageNum: pagination.current,
      pageSize: pagination.size,
      sortBy: 'latest',
    })
    if (res) {
      comments.value = res.list || []
      pagination.total = res.total || 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取留言失败')
  }
}

// 提交留言
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('你还没写呢~')
    return
  }

  const currentUser = (window as any).__user
  const payload: any = {
    content: commentContent.value.trim(),
    nickname: currentUser?.nickname || '访客',
    email: currentUser?.email || '',
  }
  if (currentUser?.avatar) {
    payload.avatar = currentUser.avatar
  }

  try {
    await messageApi.save(payload)
    ElMessage.success('留言成功！')
    commentContent.value = ''
    showEmoji.value = false
    await loadComments()
  } catch (error: any) {
    ElMessage.error(error.message || '留言失败')
  }
}

// 切换回复显示
const toggleReplies = async (item: any) => {
  if (!item.showReplies) {
    item.showReplies = true
    if (!replyMap.value[item.id]) {
      try {
        const res = await messageApi.getReplies(item.id)
        replyMap.value[item.id] = res || []
        replyTotalMap.value[item.id] = (res as any[])?.length || 0
      } catch (error: any) {
        ElMessage.error(error.message || '加载回复失败')
      }
    }
  } else {
    item.showReplies = false
  }
}

// 加载更多回复
const loadMoreReplies = async (item: any) => {
  // 当前全部加载完，不再展开
  if ((replyTotalMap.value[item.id] || 0) <= (replyMap.value[item.id]?.length || 0)) return
  try {
    const res = await messageApi.getReplies(item.id)
    replyMap.value[item.id] = res || []
    replyTotalMap.value[item.id] = (res as any[])?.length || 0
  } catch (error: any) {
    ElMessage.error(error.message || '加载回复失败')
  }
}

// 分页跳转
const toPage = (page: number) => {
  pagination.current = page
  loadComments()
}

// 添加表情
const addEmoji = (emoji: string) => {
  commentContent.value += emoji
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
}

.message-wrap {
  background: var(--cntr-bg);
  width: 75%;
  max-width: 780px;
  margin: 0 auto 40px;
  padding: 30px 40px;
  border-radius: 15px;
  min-height: 300px;
}

.message-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--greyFont);
  font-size: 14px;
}

/* 留言卡片 */
.message-card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px 0;
}

.message-card:last-child {
  border-bottom: none;
}

.message-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.message-avatar {
  border-radius: 8px;
  flex-shrink: 0;
}

.message-card-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.message-username {
  font-weight: 600;
  color: var(--orangeRed);
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: var(--greyFont);
}

.message-card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.message-top-tag {
  background: var(--themeBackground);
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.message-reply-count {
  font-size: 12px;
  color: var(--greyFont);
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

.message-reply-count:hover {
  color: var(--themeBackground);
}

.message-card-content {
  padding: 12px 0;
  line-height: 1.6;
  color: var(--black);
  word-break: break-word;
}

/* 回复列表 */
.message-replies {
  margin-top: 12px;
  padding-top: 12px;
}

.message-reply {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.message-reply-avatar {
  border-radius: 6px;
  flex-shrink: 0;
}

.message-reply-content {
  flex: 1;
  font-size: 13px;
  background: var(--comment-day-bg);
  padding: 10px 14px;
  border-radius: 10px;
}

.message-reply-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.message-reply-username {
  font-weight: 600;
  color: var(--orangeRed);
}

.message-admin-tag {
  background: var(--blue);
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
}

.message-reply-time {
  font-size: 11px;
  color: var(--greyFont);
}

.message-reply-to-user {
  font-size: 12px;
  color: var(--greyFont);
  margin-bottom: 2px;
}

.highlight {
  color: var(--blue);
  font-weight: 600;
}

.message-reply-text {
  color: var(--black);
  line-height: 1.5;
  word-break: break-word;
}

.message-reply-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin-top: 4px;
}

.message-expand {
  text-align: center;
  font-size: 12px;
  color: var(--themeBackground);
  cursor: pointer;
  padding: 6px;
}

.message-expand:hover {
  text-decoration: underline;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* 输入区域 */
.message-input-wrap {
  background: var(--cntr-bg);
  width: 75%;
  max-width: 780px;
  margin: 0 auto 60px;
  padding: 30px 40px;
  border-radius: 15px;
}

.message-input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.message-input-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fontColor);
}

.message-total {
  font-size: 13px;
  color: var(--greyFont);
}

.message-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid var(--lightGray);
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: var(--card-bg);
  color: var(--fontColor);
}

.message-textarea:focus {
  border-color: var(--themeBackground);
}

.message-textarea::placeholder {
  color: var(--greyFont);
}

.message-input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.message-input-tools {
  display: flex;
  gap: 12px;
}

.message-emoji-btn {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.message-emoji-btn:hover {
  transform: scale(1.2);
}

.message-submit-btn {
  background: var(--themeBackground);
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.message-submit-btn:hover {
  opacity: 0.85;
}

.message-emoji-panel {
  margin-top: 12px;
}

@media screen and (max-width: 900px) {
  .message-wrap {
    width: 90%;
  }

  .message-input-wrap {
    width: 90%;
  }
}
</style>
