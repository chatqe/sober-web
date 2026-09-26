<template>
  <div class="moment-page">
    <!-- 顶部横幅区域 -->
    <div class="moment-banner">
      <div class="banner-bg"></div>
      <div class="banner-content">
        <!-- 个人信息区 -->
        <div class="banner-profile">
          <el-avatar
            :src="userStore.currentUser?.avatar || defaultAvatar"
            :size="72"
            class="profile-avatar"
          />
          <div class="profile-info">
            <div class="profile-name">
              <span>{{ userStore.currentUser?.nickname || '匿名' }}</span>
              <span class="profile-badge">随笔作者</span>
            </div>
            <div class="profile-stats">
              <span class="stat"><strong>{{ pagination.total }}</strong> 动态</span>
              <span class="stat-divider">·</span>
              <span class="stat"><strong>{{ totalLikes }}</strong> 获赞</span>
            </div>
          </div>
        </div>

        <!-- Tab 切换 -->
        <div class="moment-tabs">
          <span
            class="tab-item"
            :class="{ active: activeTab === 'public' }"
            @click="switchTab('public')"
          >公开动态</span>
          <span
            v-if="isLoggedIn"
            class="tab-item"
            :class="{ active: activeTab === 'my' }"
            @click="switchTab('my')"
          >我的动态</span>
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="loading && !moments.length" class="moment-loading">
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && !moments.length" class="moment-empty">
      <div class="empty-icon">📝</div>
      <p>暂无动态</p>
      <p class="empty-hint">快来发布第一条动态吧</p>
    </div>

    <!-- 动态列表 -->
    <div v-else class="moment-list">
      <MomentCard
        v-for="moment in moments"
        :key="moment.id"
        :moment="moment"
        @deleted="handleDeleted"
        @login="handleLogin"
      />
    </div>

    <!-- 分页 -->
    <div v-if="pagination.total > pagination.pageSize" class="moment-pagination">
      <proPage
        :current="pagination.pageNum"
        :size="pagination.pageSize"
        :total="pagination.total"
        :button-size="3"
        :color="$constant?.pageColor || '#ee7752'"
        @toPage="handlePageChange"
      />
    </div>

    <!-- 发布按钮（浮动） -->
    <el-button
      v-if="isLoggedIn"
      class="moment-publish-btn"
      circle
      size="large"
      @click="showPublish = true"
    >
      <el-icon><Plus /></el-icon>
    </el-button>

    <!-- 发布弹窗 -->
    <el-dialog
      v-model="showPublish"
      title="发布动态"
      width="520px"
      :close-on-click-modal="false"
      destroy-on-close
      class="moment-publish-dialog"
    >
      <div class="publish-box">
        <div class="publish-visible">
          <span>可见范围</span>
          <el-radio-group v-model="publishForm.visibility">
            <el-radio :label="2">公开</el-radio>
            <el-radio :label="1">仅好友</el-radio>
            <el-radio :label="0">私密</el-radio>
          </el-radio-group>
        </div>
        <el-input
          v-model="publishForm.content"
          type="textarea"
          :rows="4"
          placeholder="分享此刻..."
          :maxlength="500"
          show-word-limit
        />
      </div>
      <template #footer>
        <el-button @click="showPublish = false">取消</el-button>
        <el-button type="primary" :loading="publishing" @click="handlePublish">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import * as weiYanApi from '@/api/modules/weiYan'
import type { MomentItem } from '@/api/modules/weiYan'
import MomentCard from './MomentCard.vue'
import proPage from '@/components/base/ProPage.vue'

const userStore = useUserStore()
const $constant = inject('$constant') as any
const isLoggedIn = computed(() => !!userStore.currentUser?.id)

const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// Tab
const activeTab = ref<'public' | 'my'>('public')

// 数据
const moments = ref<MomentItem[]>([])
const loading = ref(false)
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })

// 计算总获赞数
const totalLikes = computed(() =>
  moments.value.reduce((sum, m) => sum + (m.likesCount || 0), 0)
)

// 发布
const showPublish = ref(false)
const publishing = ref(false)
const publishForm = reactive({ content: '', visibility: 2 })

function switchTab(tab: 'public' | 'my') {
  activeTab.value = tab
  pagination.pageNum = 1
  moments.value = []
  loadMoments()
}

async function loadMoments() {
  if (loading.value) return
  loading.value = true
  try {
    const params = { pageNum: pagination.pageNum, pageSize: pagination.pageSize }
    const result = activeTab.value === 'my'
      ? await weiYanApi.getMyTimeline(params)
      : await weiYanApi.getTimeline(params)

    moments.value = (result.list || []) as MomentItem[]
    pagination.total = result.total ?? 0
  } catch (e: any) {
    ElMessage.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  pagination.pageNum = page
  loadMoments()
  window.scrollTo({ top: 200, behavior: 'smooth' })
}

async function handlePublish() {
  if (!publishForm.content.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  publishing.value = true
  try {
    await weiYanApi.publishMoment({
      content: publishForm.content,
      visibility: publishForm.visibility
    })
    publishForm.content = ''
    showPublish.value = false
    ElMessage.success('发布成功')
    pagination.pageNum = 1
    loadMoments()
  } catch (e: any) {
    ElMessage.error(e.message || '发布失败')
  } finally {
    publishing.value = false
  }
}

function handleDeleted(id: number) {
  moments.value = moments.value.filter(m => m.id !== id)
  pagination.total--
}

function handleLogin() {
  ElMessage.info('请先登录后操作')
}

onMounted(() => {
  loadMoments()
})
</script>

<style scoped>
.moment-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 16px 60px;
  background: rgba(240, 240, 240, 0.85);
  min-height: calc(100vh - 120px);
}

/* 顶部横幅 */
.moment-banner {
  position: relative;
  margin: 0 0 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.banner-bg {
  height: 140px;
  background: linear-gradient(135deg, #ee7752 0%, #e73c7e 50%, #23a6d5 100%);
  opacity: 0.9;
}

.banner-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.banner-content {
  position: relative;
  padding: 0 20px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 12px 12px;
}

/* 个人信息区 */
.banner-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: -36px;
  margin-bottom: 16px;
}

.profile-avatar {
  border: 4px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(135deg, #ee7752, #e73c7e);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  border-radius: 10px;
  letter-spacing: 0.5px;
}

.profile-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #888;
}

.profile-stats .stat strong {
  color: #333;
  font-weight: 600;
}

.stat-divider {
  color: #ccc;
}

/* Tabs */
.moment-tabs {
  display: flex;
  gap: 0;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.tab-item {
  padding: 10px 20px;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  font-weight: 500;
}

.tab-item:hover {
  color: #333;
}

.tab-item.active {
  color: #ee7752;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #ee7752;
  border-radius: 1px;
}

/* Loading */
.moment-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 60px 0;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ee7752;
  animation: dot-pulse 1.4s infinite ease-in-out;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes dot-pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Empty state */
.moment-empty {
  text-align: center;
  padding: 80px 24px;
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  color: #bbb;
}

.empty-icon {
  font-size: 52px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.moment-empty p {
  margin: 0 0 8px;
  font-size: 15px;
  color: #999;
}

.empty-hint {
  font-size: 13px !important;
  color: #ccc !important;
}

/* 动态列表 */
.moment-list {
  animation: list-fade-in 0.3s ease;
}

@keyframes list-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pagination */
.moment-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 16px 0;
}

/* Floating publish button */
.moment-publish-btn {
  position: fixed;
  bottom: 80px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ee7752, #e73c7e);
  color: #fff;
  box-shadow: 0 4px 16px rgba(238, 119, 82, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.moment-publish-btn:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 24px rgba(238, 119, 82, 0.55);
}

/* Publish dialog */
.publish-box {
  padding: 8px 4px;
}

.publish-visible {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
  color: #888;
}

.publish-visible :deep(.el-radio-group) {
  font-size: 13px;
}

/* Dialog overlay */
:deep(.moment-publish-dialog .el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.moment-publish-dialog .el-dialog__header) {
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.moment-publish-dialog .el-dialog__body) {
  padding: 16px 20px;
}

:deep(.moment-publish-dialog .el-dialog__footer) {
  padding: 12px 20px 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
