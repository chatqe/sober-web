<template>
  <div class="guest-book">
    <!-- 留言输入区域 -->
    <div class="guest-book-input-wrap shadow-box">
      <div class="guest-book-input-header">
        <span class="guest-book-input-title">💬 Guest Book</span>
      </div>
      <textarea
        v-model="commentContent"
        class="guest-book-textarea"
        placeholder="写下你的留言..."
        maxlength="1000"
      ></textarea>
      <div class="guest-book-input-footer">
        <button class="guest-book-submit-btn" @click="submitComment">发布留言</button>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="guest-book-list-wrap shadow-box">
      <div v-if="comments.length === 0" class="guest-book-empty">
        还没有留言，来做第一个留言的人吧~
      </div>
      <div v-for="item in comments" :key="item.id" class="guest-book-item">
        <div class="guest-book-item-header">
          <el-avatar :size="36" :src="item.avatar" class="guest-book-avatar" />
          <div class="guest-book-item-info">
            <span class="guest-book-username">{{ item.nickname }}</span>
            <span class="guest-book-time">{{ $common.getDateDiff(item.createTime) }}</span>
          </div>
        </div>
        <div class="guest-book-item-content" v-html="item.content"></div>
      </div>
      <div v-if="comments.length > 0" class="guest-book-list-footer">
        <span class="guest-book-list-total">{{ pagination.total }} 条留言</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { messageApi } from '@/api/modules'
import type { MessageVO } from '@/types/modules/messageVO'
import type { CommonUtils } from '@/types'

// 获取注入的全局属性
const $common = inject<CommonUtils>('$common')!

const comments = ref<MessageVO[]>([])
const commentContent = ref('')
const pagination = ref({ current: 1, total: 0 })

async function loadComments(): Promise<void> {
  try {
    const res = await messageApi.list({
      pageNum: pagination.value.current,
      pageSize: 10,
      sortBy: 'latest',
    })
    // /message/list 的 data 是 MessageVO[] 数组（无 list/total 字段）
    const list = Array.isArray(res) ? res : ((res as any)?.list ?? [])
    comments.value = list as MessageVO[]
    pagination.value.total = list.length
  } catch (e: any) {
    console.error('[guest book] load failed', e)
  }
}

async function submitComment(): Promise<void> {
  if (!commentContent.value.trim()) {
    ElMessage.warning('你还没写呢~')
    return
  }
  const currentUser = (window as any).__user
  try {
    await messageApi.save({
      content: commentContent.value.trim(),
      nickname: currentUser?.nickname || '访客',
      email: currentUser?.email || '',
      ...(currentUser?.avatar ? { avatar: currentUser.avatar } : {}),
    })
    ElMessage.success('留言成功！')
    commentContent.value = ''
    await loadComments()
  } catch (e: any) {
    ElMessage.error(e?.message || '留言失败')
  }
}

onMounted(loadComments)
</script>

<style scoped>
.guest-book {
  max-width: 780px;
  margin: 0 auto;
}

.guest-book-input-wrap {
  background: var(--cntr-bg);
  padding: 24px 30px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.guest-book-input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.guest-book-input-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fontColor);
}

.guest-book-textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
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

.guest-book-textarea:focus {
  border-color: var(--themeBackground);
}

.guest-book-input-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.guest-book-submit-btn {
  background: var(--themeBackground);
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.guest-book-submit-btn:hover {
  opacity: 0.85;
}

.guest-book-list-wrap {
  background: var(--cntr-bg);
  padding: 24px 30px;
  border-radius: 15px;
}

.guest-book-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--greyFont);
  font-size: 14px;
}

.guest-book-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px 0;
}

.guest-book-item:last-of-type {
  border-bottom: none;
}

.guest-book-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.guest-book-avatar {
  border-radius: 8px;
  flex-shrink: 0;
}

.guest-book-item-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.guest-book-username {
  font-weight: 600;
  color: var(--orangeRed);
  font-size: 14px;
}

.guest-book-time {
  font-size: 12px;
  color: var(--greyFont);
}

.guest-book-item-content {
  padding: 10px 0;
  line-height: 1.6;
  color: var(--fontColor);
  word-break: break-word;
}

.guest-book-list-footer {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.guest-book-list-total {
  font-size: 13px;
  color: var(--greyFont);
}

@media screen and (max-width: 900px) {
  .guest-book-input-wrap,
  .guest-book-list-wrap {
    padding: 20px;
  }
}
</style>
