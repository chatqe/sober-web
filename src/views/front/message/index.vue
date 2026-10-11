<template>
  <div class="message-page">
    <!-- 顶部标题区域 -->
    <div class="message-header">
      <div class="message-header-inner">
        <h1 class="message-title">留言板</h1>
        <p class="message-desc">说出你的心里话，我会认真看的~</p>
      </div>
    </div>

    <!-- 留言列表区域 -->
    <div class="message-list">
      <!-- 空状态 -->
      <div v-if="comments.length === 0" class="message-empty">
        <span>还没有留言，来做第一个留言的人吧~</span>
      </div>

      <!-- 留言卡片列表 -->
      <div v-for="(item, index) in comments" :key="index" class="message-card">
        <!-- 卡片头部 -->
        <div class="message-card-header">
          <el-avatar :size="40" :src="item.avatar" class="message-avatar"/>
          <div class="message-card-info">
            <span class="message-username">{{ item.username }}</span>
            <span class="message-master-tag" v-if="item.userId === masterUserId">楼主</span>
            <span class="message-time">{{ $common.getDateDiff(item.createTime) }}</span>
          </div>
          <div class="message-card-actions">
            <span class="message-reply-btn" @click="openReplyDialog(item)">回复</span>
          </div>
        </div>

        <!-- 留言内容 -->
        <div class="message-card-content" v-html="item.commentContent"></div>

        <!-- 子回复列表 -->
        <div v-if="item.childComments && item.childComments.records && item.childComments.records.length > 0" class="message-replies">
          <div v-for="(reply, i) in item.childComments.records" :key="i" class="message-reply">
            <el-avatar :size="32" :src="reply.avatar" class="message-reply-avatar"/>
            <div class="message-reply-content">
              <div class="message-reply-header">
                <span class="message-reply-username">{{ reply.username }}</span>
                <span class="message-reply-master-tag" v-if="reply.userId === masterUserId">楼主</span>
                <span class="message-reply-time">{{ $common.getDateDiff(reply.createTime) }}</span>
              </div>
              <div class="message-reply-text">
                <template v-if="reply.parentCommentId !== item.id && reply.parentUserId !== reply.userId">
                  <span class="message-reply-to">@{{ reply.parentUsername }} </span>:
                </template>
                <span v-html="reply.commentContent"></span>
              </div>
              <span class="message-reply-btn" @click="openReplyDialog(reply, item)">回复</span>
            </div>
          </div>
          <!-- 展开更多回复 -->
          <div v-if="item.childComments.records.length < (item.childComments.total || 0)" class="message-expand" @click="expandReply(item)">
            展开 {{ item.childComments.total - item.childComments.records.length }} 条回复
          </div>
        </div>

        <!-- 分页 -->
        <proPage
          v-if="item.childComments && item.childComments.total > 5"
          :current="item.childComments.current || 1"
          :size="5"
          :total="item.childComments.total"
          :buttonSize="3"
          :color="$constant.commentPageColor"
          @toPage="(page: number) => childPageChange(item, page)"
        />
      </div>

      <!-- 总分页 -->
      <proPage
        v-if="pagination.total > pagination.size"
        :current="pagination.current"
        :size="pagination.size"
        :total="pagination.total"
        :buttonSize="6"
        :color="$constant.commentPageColor"
        @toPage="toPage"
      />
    </div>

    <!-- 留言输入区域 -->
    <div class="message-input-area">
      <div class="message-input-box">
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
          <Emoji @addEmoji="addEmoji" :showEmoji="showEmoji"/>
        </div>
      </div>
    </div>

    <!-- 回复弹窗 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复留言"
      width="400px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="reply-dialog-content">
        <div v-if="replyTarget" class="reply-target">
          <span>回复 @{{ replyTarget.username }}：</span>
        </div>
        <textarea
          v-model="replyContent"
          class="reply-textarea"
          placeholder="写下你的回复..."
          maxlength="500"
        ></textarea>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReply">发送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject, defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { commentApi } from '@/api/modules'
import type { CommonUtils, AppConstants } from '@/types'
import proPage from '@/components/base/ProPage.vue'

const $common = inject<CommonUtils>('$common')!
const $constant = inject<AppConstants>('$constant')!

const Emoji = defineAsyncComponent(() => import('@/components/business/comment/Emoji.vue'))

// 配置
const SOURCE_ID = 0  // 留言板专属 bizId
const COMMENT_TYPE = 2  // MESSAGE = 2 (树洞留言)

// 状态
const comments = ref<any[]>([])
const commentContent = ref('')
const showEmoji = ref(false)
const replyDialogVisible = ref(false)
const replyContent = ref('')
const replyTarget = ref<any>(null)
const floorComment = ref<any>(null)

// 获取当前用户ID（楼主人）
const masterUserId = ref<number>(0)

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  keyword: ''
})

// 加载留言列表
const loadComments = async () => {
  try {
    const res = await commentApi.listComment({
      pageNum: pagination.current,
      pageSize: pagination.size,
      bizId: SOURCE_ID,
      commentType: String(COMMENT_TYPE),
      order: 'createTime',
      desc: true
    })
    if (res) {
      comments.value = res.records || []
      pagination.total = res.total || 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取留言失败')
  }
}

// 获取留言数量
const loadTotal = async () => {
  try {
    const res = await commentApi.getCommentTotal(SOURCE_ID, String(COMMENT_TYPE))
    if (res) {
      pagination.total = res.count || 0
    }
  } catch (error: any) {
    // 忽略错误
  }
}

// 提交留言
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('你还没写呢~')
    return
  }

  try {
    await commentApi.saveComment({
      bizId: SOURCE_ID,
      bizType: COMMENT_TYPE,
      content: commentContent.value.trim()
    })
    ElMessage.success('留言成功！')
    commentContent.value = ''
    showEmoji.value = false
    await loadComments()
    await loadTotal()
  } catch (error: any) {
    ElMessage.error(error.message || '留言失败')
  }
}

// 打开回复弹窗
const openReplyDialog = (target: any, floor?: any) => {
  replyTarget.value = target
  floorComment.value = floor || target
  replyContent.value = ''
  replyDialogVisible.value = true
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('你还没写呢~')
    return
  }

  try {
    await commentApi.saveComment({
      bizId: SOURCE_ID,
      bizType: COMMENT_TYPE,
      floorCommentId: floorComment.value?.id,
      content: replyContent.value.trim(),
      parentCommentId: replyTarget.value.id,
      parentUserId: replyTarget.value.userId
    })
    ElMessage.success('回复成功！')
    replyDialogVisible.value = false
    replyContent.value = ''
    await loadComments()
  } catch (error: any) {
    ElMessage.error(error.message || '回复失败')
  }
}

// 分页跳转
const toPage = (page: number) => {
  pagination.current = page
  loadComments()
}

// 展开子回复
const expandReply = async (comment: any) => {
  if (!comment.childComments) {
    comment.childComments = { current: 0, total: 0, records: [] }
  }
  comment.childComments.current = (comment.childComments.current || 1) + 1
  try {
    const res = await commentApi.listComment({
      pageNum: comment.childComments.current,
      pageSize: 5,
      bizId: SOURCE_ID,
      commentType: String(COMMENT_TYPE),
      rootId: comment.id
    })
    if (res) {
      if (!comment.childComments.records) {
        comment.childComments.records = []
      }
      comment.childComments.records = comment.childComments.records.concat(res.records || [])
      comment.childComments.total = res.total || 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载回复失败')
  }
}

// 子回复分页
const childPageChange = async (comment: any, page: number) => {
  if (!comment.childComments) return
  comment.childComments.current = page
  try {
    const res = await commentApi.listComment({
      pageNum: page,
      pageSize: 5,
      bizId: SOURCE_ID,
      commentType: String(COMMENT_TYPE),
      rootId: comment.id
    })
    if (res) {
      comment.childComments.records = res.records || []
      comment.childComments.total = res.total || 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载回复失败')
  }
}

// 添加表情
const addEmoji = (emoji: string) => {
  commentContent.value += emoji
}

// 处理用户信息
const handleUser = () => {
  const currentUser = (window as any).__user
  if (currentUser?.id) {
    masterUserId.value = currentUser.id
  }
}

onMounted(() => {
  handleUser()
  loadComments()
  loadTotal()
})
</script>

<style scoped>
.message-page {
  min-height: calc(100vh - 60px);
  background: var(--background);
  padding-bottom: 40px;
}

/* 顶部标题 */
.message-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  text-align: center;
  color: #fff;
}

.message-header-inner {
  max-width: 600px;
  margin: 0 auto;
}

.message-title {
  font-size: 32px;
  margin-bottom: 12px;
  font-weight: 600;
}

.message-desc {
  font-size: 14px;
  opacity: 0.9;
}

/* 留言列表 */
.message-list {
  max-width: 800px;
  margin: -30px auto 0;
  padding: 0 16px;
}

.message-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--greyFont);
  font-size: 14px;
}

/* 留言卡片 */
.message-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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

.message-master-tag {
  background: var(--green);
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: var(--greyFont);
}

.message-card-actions {
  flex-shrink: 0;
}

.message-reply-btn {
  font-size: 12px;
  color: #fff;
  background: var(--themeBackground);
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
}

.message-reply-btn:hover {
  opacity: 0.8;
}

.message-card-content {
  padding: 12px 0;
  line-height: 1.6;
  color: var(--black);
  word-break: break-word;
}

/* 子回复 */
.message-replies {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--lightGray);
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

.message-reply-master-tag {
  background: var(--green);
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
}

.message-reply-time {
  font-size: 11px;
  color: var(--greyFont);
}

.message-reply-text {
  color: var(--black);
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-reply-to {
  color: var(--blue);
}

.message-expand {
  text-align: center;
  font-size: 12px;
  color: var(--themeBackground);
  cursor: pointer;
  padding: 8px;
}

.message-expand:hover {
  text-decoration: underline;
}

/* 输入区域 */
.message-input-area {
  max-width: 800px;
  margin: 24px auto 0;
  padding: 0 16px;
}

.message-input-box {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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
  color: var(--black);
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
}

.message-textarea:focus {
  border-color: var(--themeBackground);
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

/* 回复弹窗 */
.reply-dialog-content {
  padding: 10px 0;
}

.reply-target {
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--greyFont);
}

.reply-textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid var(--lightGray);
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.reply-textarea:focus {
  border-color: var(--themeBackground);
}
</style>

